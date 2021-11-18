import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../models/userModel.js'
import Game from '../models/gameModel.js'
import Wanted from '../models/wantedModel.js'
import { hashPassword, generateToken } from '../helpers/helpers.js'

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
		const user = await User.findOne({ email }).select('_id email username isAdmin token')
		res.status(200).json({
			_id      : user._id,
			email    : user.email,
			username : user.username,
			isAdmin  : user.isAdmin,
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

		res.status(400)
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

		res.status(200).end()
	}
})

// ~ @desc    Get single user profile data
// ~ @route   GET  /api/users/:username
// ~ @access  Private route
const getUserProfileData = asyncHandler(async (req, res) => {
	const { username } = req.params
	const { _id: userId } = req.userId

	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()
		res.status(404)
		throw {
			message : err.username.msg
		}
	}

	const saleGamesData = await Game.find({ seller: userId, isActive: true, mode: 'sell' })
		.select('_id mode games type altId totalPrice')
		.limit(6)
		.sort({ updatedAt: -1 })
		.lean()

	const tradeGamesData = await Game.find({ seller: userId, isActive: true, mode: 'trade' })
		.select('_id mode games type altId')
		.limit(6)
		.sort({ updatedAt: -1 })
		.lean()

	const wantedGamesData = await Wanted.find({ wantedBy: userId, isActive: true })
		.limit(6)
		.sort({ updatedAt: -1 })
		.lean()

	console.log(username)
	res.status(200).json({ saleGamesData, tradeGamesData, wantedGamesData })
})

export { userAuth, userRegister, changePassword, getUserProfileData }
