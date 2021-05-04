import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../models/userModel.js'
import { comparePasswords, hashPassword, generateToken } from '../helpers/helpers.js'

// @desc    Sign in user & get token
// @route   POST  /api/users/signin
// @access  Public route
const userAuth = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	let emailError = null
	let passwordError = null

	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()

		emailError = err.email ? err.email.msg : null
		passwordError = err.password ? err.password.msg : null
	}

	let user
	if (!emailError) {
		user = await User.findOne({ email })
		if (user) {
			const compared = await comparePasswords(password, user.password)
			if (!compared) {
				passwordError = passwordError ? passwordError : 'Incorrect password'
			}
		} else {
			emailError = 'User with this email address does not exist'
		}
	}

	if (emailError || passwordError) {
		res.status(401)
		throw {
			status : 'ERROR',
			errors : {
				emailError,
				passwordError
			}
		}
	} else {
		res.status(200).json({
			_id      : user._id,
			email    : user.email,
			username : user.username,
			isAdmin  : user.isAdmin,
			token    : generateToken(user._id)
		})
	}
})

// @desc    Register user & get token
// @route   POST  /api/users/signup
// @access  Public route
const userRegister = asyncHandler(async (req, res) => {
	const { email, username, password } = req.body

	let emailError = null
	let usernameError = null
	let passwordError = null
	let passwordConfirmationError = null

	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()

		emailError = err.email ? err.email.msg : null
		usernameError = err.username ? err.username.msg : null
		passwordError = err.password ? err.password.msg : null
		passwordConfirmationError = err.passwordConfirmation ? err.passwordConfirmation.msg : null
	}

	const userExists = await User.findOne({ email })
	if (userExists) {
		emailError = 'User with this email address already exists'
	}

	const usernameExists = await User.findOne({ username })
	if (usernameExists) {
		usernameError = 'Username already taken'
	}

	if (emailError || usernameError || passwordError || passwordConfirmationError) {
		res.status(400)
		throw {
			status : 'ERROR',
			errors : {
				emailError,
				usernameError,
				passwordError,
				passwordConfirmationError
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
				token    : generateToken(user._id)
			})
		}
	}
})

export { userAuth, userRegister }
