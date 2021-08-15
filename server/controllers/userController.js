import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../models/userModel.js'
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
				messages : { received: [], send: [] },
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
		const pw = await hashPassword(passwordNew)
		await User.updateOne({ _id: req.user._id }, { password: pw })

		res.status(200).end()
	}
})

// * @desc    Send message
// * @route   POST  /api/users/message
// * @access  Private route
const sendMessage = asyncHandler(async (req, res) => {
	const { subject, message, recipientUsername, recipientId } = req.body

	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()

		res.status(400)
		throw {
			message : {
				recipientUsernameError : err.recipientUsername ? err.recipientUsername.msg : null,
				subjectError           : err.subject ? err.subject.msg : null,
				messageError           : err.message ? err.message.msg : null
			}
		}
	} else {
		// Recipient
		const recipient = await User.findOne({ _id: recipientId }).select('received').lean()
		recipient.received.unshift({ subject, message })
		console.log(recipient)
		await User.updateOne({ _id: recipientId }, { received: recipient.received })

		// Sender
		const sender = await User.findOne({ _id: req.user._id }).select('sent').lean()
		sender.sent.unshift({ subject, message })
		await User.updateOne({ _id: req.user._id }, { sent: sender.sent })

		res.status(200).end()
	}
})

export { userAuth, userRegister, changePassword, sendMessage }
