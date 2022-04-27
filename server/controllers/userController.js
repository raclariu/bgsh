import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../models/userModel.js'
import Game from '../models/gameModel.js'
import Token from '../models/tokenModel.js'
import { hashPassword, generateToken } from '../helpers/helpers.js'
import storage from '../helpers/storage.js'
import { genNanoId } from '../helpers/helpers.js'
import { sendAccountActivationMail, sendForgotPasswordMail } from '../helpers/mailer.js'
import { differenceInMinutes } from 'date-fns'

// * @desc    Log in user & get jwt token
// * @route   POST  /api/users/login
// * @access  Public route
const userLogin = asyncHandler(async (req, res) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()

		res.status(401)
		throw {
			code    : 10,
			message : {
				emailError    : err.email ? err.email.msg : null,
				passwordError : err.password ? err.password.msg : null
			}
		}
	} else {
		const { email } = req.body
		const user = await User.findOne({ email }).select('_id email username isAdmin status').lean()

		if (user.status === 'pending') {
			const tokenDoc = await Token.findOne({ addedBy: user._id, reason: 'new-account' }).lean()
			const baseDomain =
				process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.BASE_DOMAIN

			if (!tokenDoc) {
				const createNewTokenDoc = await Token.create({
					addedBy : user._id,
					reason  : 'new-account'
				})

				const activationUrl = baseDomain + `/activate/${createNewTokenDoc.tokenUid}`
				await sendAccountActivationMail({ address: user.email, url: activationUrl })

				res.status(403)
				throw {
					code    : 11,
					message : `Account is not active. An activation email has been sent to ${user.email}`
				}
			} else {
				const lookback = differenceInMinutes(new Date(), tokenDoc.sent)
				if (lookback >= 15) {
					const activationUrl = baseDomain + `/activate/${tokenDoc.tokenUid}`
					await sendAccountActivationMail({ address: user.email, url: activationUrl })
					await Token.updateOne({ _id: tokenDoc._id }, { sent: new Date() })

					res.status(403)
					throw {
						code    : 11,
						message : `Account is not active. An activation email has been sent to ${user.email}`
					}
				} else {
					res.status(403)
					throw {
						code    : 11,
						message : `Activation email already send. You can retry in ${15 - lookback} minutes`
					}
				}
			}
		}

		await User.updateOne({ _id: user._id }, { lastSeen: Date.now() })
		return res.status(200).json(generateToken(user._id))
	}
})

// * @desc    Register user & send activation email
// * @route   POST  /api/users/signup
// * @access  Public route
const userRegister = asyncHandler(async (req, res) => {
	const { email, username, password } = req.body

	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()

		res.status(401)
		throw {
			message : {
				emailError                : err.email ? err.email.msg : null,
				usernameError             : err.username ? err.username.msg : null,
				passwordError             : err.password ? err.password.msg : null,
				passwordConfirmationError : err.passwordConfirmation ? err.passwordConfirmation.msg : null
			}
		}
	} else {
		const user = await User.create({
			email,
			username,
			password : await hashPassword(password)
		})

		const createdTokenDoc = await Token.create({
			addedBy : user._id,
			reason  : 'new-account'
		})

		const baseDomain = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.BASE_DOMAIN
		const activationUrl = baseDomain + `/activate/${createdTokenDoc.tokenUid}`
		await sendAccountActivationMail({ address: user.email, url: activationUrl })

		return res.status(204).end()
	}
})

// ~ @desc    Activate user account
// ~ @route   GET  /api/users/activate/:tokenUid
// ~ @access  Private route
const activateAccount = asyncHandler(async (req, res) => {
	const { tokenUid } = req.params

	const tokenDoc = await Token.findOne({ tokenUid, reason: 'new-account' }).lean()

	if (!tokenDoc) {
		res.status(400)
		throw {
			message : 'Link expired, altered or already used'
		}
	}

	const user = await User.findById({ _id: tokenDoc.addedBy }).select('_id username status isAdmin').lean()

	if (user.status === 'active') {
		res.status(400)
		throw {
			message : 'Your account is already active, you can log in'
		}
	}

	await User.updateOne({ _id: tokenDoc.addedBy }, { status: 'active' })
	await Token.deleteOne({ tokenUid, reason: 'new-account' })

	console.log({
		message : {
			_id       : user._id,
			username  : user.username,
			timestamp : new Date(),
			info      : 'new account'
		}
	})

	return res.status(200).json(generateToken(user._id))
})

// ~ @desc    Get current user data
// ~ @route   GET  /api/users/me
// ~ @access  Private route
const getMe = asyncHandler(async (req, res) => {
	return res.status(200).json({ _id: req.user._id, username: req.user.username, isAdmin: req.user.isAdmin })
})

// * @desc    Change password
// * @route   POST  /api/users/password/change
// * @access  Private route
const changePassword = asyncHandler(async (req, res) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()

		res.status(400)
		throw {
			message : {
				passwordCurrentError         : err.passwordCurrent ? err.passwordCurrent.msg : null,
				passwordNewError             : err.passwordNew ? err.passwordNew.msg : null,
				passwordNewConfirmationError : err.passwordNewConfirmation ? err.passwordNewConfirmation.msg : null
			}
		}
	} else {
		const { passwordNew } = req.body
		const hashed = await hashPassword(passwordNew)
		await User.updateOne({ _id: req.user._id }, { password: hashed })

		return res.status(204).end()
	}
})

// * @desc    Forgot password
// * @route   POST  /api/users/password/forgot
// * @access  Private route
const forgotPassword = asyncHandler(async (req, res) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()

		res.status(400)
		throw {
			message : {
				emailError : err.email ? err.email.msg : null
			}
		}
	} else {
		const { email } = req.body
		const user = await User.findOne({ email }).select('_id email').lean()
		const pwTokenDoc = await Token.findOne({ addedBy: user._id, reason: 'forgot-password' }).lean()
		const baseDomain = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.BASE_DOMAIN

		if (pwTokenDoc) {
			const lookback = differenceInMinutes(new Date(), pwTokenDoc.sent)

			if (lookback >= 15) {
				const resetUrl = baseDomain + `/reset-password/${pwTokenDoc.tokenUid}`
				await sendForgotPasswordMail({ address: user.email, url: resetUrl })
				await Token.updateOne({ _id: pwTokenDoc._id }, { sent: new Date() })

				res.status(403)
				throw {
					code    : 14,
					message : `A new reset email has been sent to ${user.email}`
				}
			} else {
				res.status(403)
				throw {
					code    : 14,
					message : `Reset email already send. You can retry in ${15 - lookback} minutes`
				}
			}
		} else {
			const createdPwTokenDoc = await Token.create({
				addedBy : user._id,
				reason  : 'forgot-password'
			})

			const resetUrl = baseDomain + `/reset-password/${createdPwTokenDoc.tokenUid}`
			await sendForgotPasswordMail({ address: user.email, url: resetUrl })

			return res.status(204).end()
		}
	}
})

// * @desc    Reset and change password after user forgot their password
// * @route   POST  /api/users/password/change
// * @access  Private route
const resetPassword = asyncHandler(async (req, res) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()

		res.status(400)
		throw {
			message : {
				passwordNewError             : err.passwordNew ? err.passwordNew.msg : null,
				passwordNewConfirmationError : err.passwordNewConfirmation ? err.passwordNewConfirmation.msg : null
			}
		}
	} else {
		const { passwordNew, tokenUid } = req.body

		const pwTokenDoc = await Token.findOne({ tokenUid, reason: 'forgot-password' }).lean()

		if (!pwTokenDoc) {
			res.status(400)
			throw {
				message : 'Link expired. Use the password reset form again'
			}
		}

		const hashed = await hashPassword(passwordNew)
		await User.updateOne({ _id: pwTokenDoc.addedBy }, { password: hashed })
		await Token.deleteOne({ _id: pwTokenDoc._id })

		return res.status(204).end()
	}
})

// * @desc    Change avatar
// * @route   POST  /api/users/avatar
// * @access  Private route
const changeAvatar = asyncHandler(async (req, res) => {
	try {
		const fileName = genNanoId(15)
		const bucket = storage.bucket(process.env.AVT_BUCKET)
		const file = bucket.file(`${fileName}.webp`)

		await file.save(req.file.buffer, {
			resumable : false,
			metadata  : {
				contentType  : 'image/webp',
				cacheControl : 'public, max-age=31536000'
			}
		})

		await file.makePublic()
		const publicUrl = file.publicUrl()
		const user = await User.findById({ _id: req.user._id }).select('_id avatar')
		if (user.avatar) {
			const extractName = user.avatar.split('/').pop()
			await bucket.file(extractName).delete({ ignoreNotFound: true })
		}
		user.avatar = publicUrl
		user.save()

		return res.status(200).json({ avatar: publicUrl })
	} catch (error) {
		res.status(503)
		throw { message: 'Error while changing avatar. Try again' }
	}
})

// ~ @desc    Get single user data
// ~ @route   GET  /api/users/:username
// ~ @access  Private route
const getUserProfileData = asyncHandler(async (req, res) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()
		res.status(404)
		throw {
			message : err.username.msg
		}
	}

	const { _id: userId } = req.userId

	const user = await User.findById({ _id: userId })
		.select('_id username avatar status socials lastSeen createdAt')
		.lean()

	const { _id, username, avatar, socials, status, lastSeen, createdAt } = user

	return res.status(200).json({
		user : { _id, username, avatar, socials, status: status === 'banned' ? 'banned' : null, lastSeen, createdAt }
	})
})

// ~ @desc    Get single user profile data
// ~ @route   GET  /api/users/:username/listings
// ~ @access  Private route
const getUserProfileListingsData = asyncHandler(async (req, res) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()
		res.status(404)
		throw {
			message : err.username.msg
		}
	}

	const { _id: userId } = req.userId

	const saleGames = await Game.find({ addedBy: userId, isActive: true, mode: 'sell' })
		.select('_id mode games isPack altId totalPrice')
		.limit(18)
		.sort({ createdAt: -1 })
		.lean()

	const tradeGames = await Game.find({ addedBy: userId, isActive: true, mode: 'trade' })
		.select('_id mode games isPack altId')
		.limit(18)
		.sort({ createdAt: -1 })
		.lean()

	const wantedGames = await Game.find({ addedBy: userId, isActive: true, mode: 'want' })
		.select('_id mode games isPack altId')
		.limit(18)
		.sort({ createdAt: -1 })
		.lean()

	return res.status(200).json({ saleGames, tradeGames, wantedGames })
})

// ~ @desc    Get own avatar
// ~ @route   GET /api/users/avatar
// ~ @access  Private route
const getOwnAvatar = asyncHandler(async (req, res) => {
	const user = await User.findById({ _id: req.user._id }).select('avatar').lean()
	return res.status(200).json({ avatar: user.avatar })
})

// ~ @desc    Get own socials
// ~ @route   GET  /api/users/socials
// ~ @access  Private route
const getSocials = asyncHandler(async (req, res) => {
	const user = await User.findById({ _id: req.user._id }).select('socials').lean()
	return res.status(200).json({ socials: user.socials })
})

// * @desc    Update socials
// * @route   POST  /api/users/socials
// * @access  Private route
const updateSocials = asyncHandler(async (req, res) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()
		res.status(400)
		throw {
			message : {
				bggUsernameError : err.bggUsername ? err.bggUsername.msg : null,
				fbgUsernameError : err.fbgUsername ? err.fbgUsername.msg : null
			}
		}
	}

	const { bggUsername, fbgUsername, show } = req.body
	await User.updateOne(
		{ _id: req.user._id },
		{
			socials : {
				bggUsername,
				fbgUsername,
				show        : bggUsername === null && fbgUsername === null ? false : show
			}
		}
	)
	return res.status(204).end()
})

// ~ @desc    Get email notification status for new messages
// ~ @route   GET  /api/users/email/status
// ~ @access  Private route
const getEmailNotificationStatus = asyncHandler(async (req, res) => {
	const user = await User.findById({ _id: req.user._id }).select('emailNotifications').lean()
	return res.status(200).json({ emailNotifications: user.emailNotifications })
})

// <> @desc    Update email notification status for new messages
// <> @route   PATCH  /api/users/email/status
// <> @access  Private route
const updateEmailNotificationStatus = asyncHandler(async (req, res) => {
	const user = await User.findById({ _id: req.user._id }).select('emailNotifications').lean()
	const updateEmailNtfStatus = await User.findOneAndUpdate(
		{ _id: req.user._id },
		{ emailNotifications: !user.emailNotifications },
		{ new: true, select: 'emailNotifications' }
	)

	return res.status(200).json({ emailNotifications: updateEmailNtfStatus.emailNotifications })
})

export {
	userLogin,
	userRegister,
	activateAccount,
	changePassword,
	getMe,
	forgotPassword,
	resetPassword,
	getUserProfileData,
	getUserProfileListingsData,
	changeAvatar,
	getOwnAvatar,
	getSocials,
	updateSocials,
	getEmailNotificationStatus,
	updateEmailNotificationStatus
}
