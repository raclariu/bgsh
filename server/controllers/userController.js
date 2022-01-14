import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../models/userModel.js'
import Game from '../models/gameModel.js'
import Notification from '../models/notificationModel.js'
import { hashPassword, generateToken } from '../helpers/helpers.js'
import gcsStorage from '../helpers/gcs.js'
import sharp from 'sharp'

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
				email    : user.email,
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
const changeAvatar = asyncHandler(async (req, res, err) => {
	if (!req.file) {
		res.status(422)
		throw {
			message : `Only images are allowed`
		}
	}
	console.log('inside ctrl', req.file)
	const sharpBuffer = await sharp(req.file.buffer).resize(100).grayscale().toBuffer()

	const bucket = gcsStorage.bucket('bgsh-avatars')
	const name = `${Date.now()}-${req.file.originalname}`

	const file = bucket.file(name)

	const stream = file.createWriteStream({
		metadata : {
			contentType : req.file.mimetype
		}
	})

	stream.on('error', (err) => {
		console.log(err)
	})

	stream.on('finish', async () => {
		await file.makePublic()
		const user = await User.findById({ _id: req.user._id }).select('_id avatar')
		user.avatar = `https://storage.googleapis.com/bgsh-avatars/${name}`
		user.save()
		console.log('done @ ', `https://storage.googleapis.com/bgsh-avatars/${name}`)
		return res.status(200).json({ avatar: `https://storage.googleapis.com/bgsh-avatars/${name}` })
	})

	stream.end(sharpBuffer)
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

export { userAuth, userRegister, changePassword, getUserProfileData, getNotifications, changeAvatar }
