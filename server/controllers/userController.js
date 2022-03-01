import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../models/userModel.js'
import Game from '../models/gameModel.js'
import Token from '../models/tokenModel.js'
import Notification from '../models/notificationModel.js'
import { hashPassword, generateToken } from '../helpers/helpers.js'
import storage from '../helpers/storage.js'
import { genNanoId } from '../helpers/helpers.js'
import { sendAccountActivationMail } from '../helpers/mailer.js'
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
			const tokenDoc = await Token.findOne({ addedBy: user._id }).lean()
			const baseDomain =
				process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.BASE_DOMAIN

			if (!tokenDoc) {
				const createNewTokenDoc = await Token.create({
					addedBy : user._id
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
					console.log(lookback)
					res.status(403)
					throw {
						code    : 11,
						message : `Activation email already send. You can retry in ${15 - lookback} minutes`
					}
				}
			}
		}

		await User.updateOne({ _id: user._id }, { lastSeen: Date.now() })
		return res.status(200).json({
			_id      : user._id,
			username : user.username,
			isAdmin  : user.isAdmin,
			token    : generateToken(user._id)
		})
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
			addedBy : user._id
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

	const tokenDoc = await Token.findOne({ tokenUid }).lean()

	if (!tokenDoc) {
		res.status(400)
		throw {
			message : 'Link expired, altered or already used. Try to log in and a new activation email will be sent'
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
	await Token.deleteOne({ tokenUid })
	return res.status(200).json({
		_id      : user._id,
		username : user.username,
		isAdmin  : user.isAdmin,
		token    : generateToken(user._id)
	})
})

// * @desc    Change password
// * @route   POST  /api/users/password
// * @access  Private route
const changePassword = asyncHandler(async (req, res) => {
	const { passwordNew } = req.body

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
		const hashed = await hashPassword(passwordNew)
		await User.updateOne({ _id: req.user._id }, { password: hashed })

		res.status(204).end()
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

// ~ @desc    Get single user profile data
// ~ @route   GET  /api/users/:username
// ~ @access  Private route
const getUserProfileData = asyncHandler(async (req, res) => {
	const { _id: userId } = req.userId

	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()
		res.status(404)
		throw {
			message : err.username.msg
		}
	}

	const saleGames = await Game.find({ addedBy: userId, isActive: true, mode: 'sell' })
		.select('_id mode games isPack altId totalPrice')
		.limit(6)
		.sort({ updatedAt: -1 })
		.lean()

	const tradeGames = await Game.find({ addedBy: userId, isActive: true, mode: 'trade' })
		.select('_id mode games isPack altId')
		.limit(6)
		.sort({ updatedAt: -1 })
		.lean()

	const wantedGames = await Game.find({ addedBy: userId, isActive: true, mode: 'want' })
		.select('_id mode games isPack altId')
		.limit(6)
		.sort({ updatedAt: -1 })
		.lean()

	const user = await User.findById({ _id: userId }).select('_id username avatar lastSeen createdAt').lean()

	const { _id, username, avatar, lastSeen, createdAt } = user

	return res
		.status(200)
		.json({ saleGames, tradeGames, wantedGames, user: { _id, username, avatar, lastSeen, createdAt } })
})

// ~ @desc    Get notifications
// ~ @route   GET /api/notifications
// ~ @access  Private route
const getNotifications = asyncHandler(async (req, res) => {
	const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).lean()

	res.status(200).json({ notifications })
})

// ~ @desc    Get own avatar
// ~ @route   GET /api/users/avatar
// ~ @access  Private route
const getOwnAvatar = asyncHandler(async (req, res) => {
	const user = await User.findOne({ _id: req.user._id }).select('avatar').lean()
	return res.status(200).json({ avatar: user.avatar })
})

export {
	userLogin,
	userRegister,
	activateAccount,
	changePassword,
	getUserProfileData,
	getNotifications,
	changeAvatar,
	getOwnAvatar
}
