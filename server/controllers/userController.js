import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../models/userModel.js'
import Game from '../models/gameModel.js'
import Notification from '../models/notificationModel.js'
import { hashPassword, generateToken } from '../helpers/helpers.js'
import storage from '../helpers/storage.js'
import { genNanoId } from '../helpers/helpers.js'

// * @desc    Sign in user & get token
// * @route   POST  /api/users/signin
// * @access  Public route
const userAuth = asyncHandler(async (req, res) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()

		res.status(401)
		throw {
			message : {
				emailError    : err.email ? err.email.msg : null,
				passwordError : err.password ? err.password.msg : null
			}
		}
	} else {
		const { email } = req.body
		const user = await User.findOne({ email }).select('_id email username isAdmin token avatar')
		user.lastSeen = Date.now()
		user.save()
		res.status(200).json({
			_id      : user._id,
			email    : user.email,
			username : user.username,
			isAdmin  : user.isAdmin,
			avatar   : user.avatar,
			token    : generateToken(user._id)
		})
	}
})

// * @desc    Register user & get token
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

		if (user) {
			res.status(201).json({
				_id      : user._id,
				username : user.username,
				isAdmin  : user.isAdmin,
				token    : generateToken(user._id)
			})
		}
	}
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

	return res.status(200).json({ saleGames, tradeGames, wantedGames })
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

export { userAuth, userRegister, changePassword, getUserProfileData, getNotifications, changeAvatar, getOwnAvatar }
