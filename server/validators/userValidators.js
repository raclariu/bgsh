import { check } from 'express-validator'
import User from '../models/userModel.js'
import { comparePasswords, hashPassword, generateToken } from '../helpers/helpers.js'

const validateEmail = check('email')
	.trim()
	.notEmpty()
	.withMessage('Email is required')
	.bail()
	.normalizeEmail()
	.isEmail()
	.withMessage('Invalid email address')
	.bail()
	.custom(async (email) => {
		const userExists = await User.findOne({ email }).select('_id').lean()
		if (!userExists) {
			throw new Error('User with this email address does not exist')
		} else {
			return true
		}
	})

const validateEmailDuplicate = check('email')
	.trim()
	.notEmpty()
	.withMessage('Email is required')
	.bail()
	.normalizeEmail()
	.isEmail()
	.withMessage('Invalid email address')
	.bail()
	.custom(async (email) => {
		const userExists = await User.findOne({ email }).select('_id').lean()
		if (userExists) {
			throw new Error('User with this email address already exists')
		} else {
			return true
		}
	})

const validatePassword = check('password')
	.trim()
	.notEmpty()
	.withMessage('Password is required')
	.bail()
	.isLength({ min: 6 })
	.withMessage('Password must be longer than 6 characters')
	.bail()
	.custom(async (password, { req }) => {
		const { email } = req.body
		const userExists = await User.findOne({ email }).select('password').lean()
		if (userExists) {
			const correctPw = await comparePasswords(password, userExists.password)
			if (!correctPw) {
				throw new Error('Invalid password')
			} else {
				return true
			}
		}
	})

const validatePasswordConfirmation = check('passwordConfirmation')
	.trim()
	.notEmpty()
	.withMessage('Password confirmation is required')
	.bail()
	.isLength({ min: 6 })
	.withMessage('Password confirmation must be longer than 6 characters')
	.bail()
	.custom((passwordConfirmation, { req }) => {
		return passwordConfirmation === req.body.password
	})
	.withMessage('Password confirmation does not match password')

const validateUsername = check('username')
	.trim()
	.notEmpty()
	.withMessage('Username is required')
	.bail()
	.isLength({ min: 4, max: 20 })
	.withMessage('Username must have between 4 and 20 characters')
	.bail()
	.isAlphanumeric()
	.withMessage('Username can only contain letters and numbers')
	.bail()
	.custom(async (username) => {
		const usernameExists = await User.findOne({ username }).select('_id').lean()
		if (usernameExists) {
			throw new Error(`Username '${username}' already taken`)
		} else {
			return true
		}
	})

const validatePasswordCurrent = check('passwordCurrent')
	.trim()
	.notEmpty()
	.withMessage('Current password is required')
	.bail()
	.isLength({ min: 6 })
	.withMessage('Password must be longer than 6 characters')
	.bail()
	.custom(async (passwordCurrent, { req }) => {
		const { email } = req.user
		const userExists = await User.findOne({ email }).select('password').lean()
		if (userExists) {
			const correctPw = await comparePasswords(passwordCurrent, userExists.password)
			if (!correctPw) {
				throw new Error('Invalid current password')
			} else {
				return true
			}
		}
	})

const validatePasswordNew = check('passwordNew')
	.trim()
	.notEmpty()
	.withMessage('New password is required')
	.bail()
	.isLength({ min: 6 })
	.withMessage('New password must be longer than 6 characters')
	.bail()
	.custom((passwordNew, { req }) => {
		return passwordNew !== req.body.passwordCurrent
	})
	.withMessage('New password cannot be the same to the current password')

const validatePasswordNewConfirmation = check('passwordNewConfirmation')
	.trim()
	.notEmpty()
	.withMessage('New password confirmation is required')
	.bail()
	.isLength({ min: 6 })
	.withMessage('New password confirmation must be longer than 6 characters')
	.bail()
	.custom((passwordNewConfirmation, { req }) => {
		return passwordNewConfirmation === req.body.passwordNew
	})
	.withMessage('New password confirmation does not match new password')

const validateMessageRecipient = check('recipientUsername')
	.trim()
	.notEmpty()
	.withMessage('Username is required')
	.bail()
	.isLength({ min: 4, max: 20 })
	.withMessage('Username must have between 4 and 20 characters')
	.bail()
	.isAlphanumeric()
	.withMessage('Username can only contain letters and numbers')
	.bail()
	.custom(async (username, { req }) => {
		if (username === req.user.username) {
			throw new Error('You cannot buy your own games')
		}

		if (username) {
			const usernameExists = await User.findOne({ username }).select('_id').lean()

			if (!usernameExists) {
				throw new Error('User not found')
			} else {
				return true
			}
		}
	})

const validateMessageSubject = check('subject')
	.trim()
	.notEmpty()
	.withMessage('Subject is required')
	.bail()
	.isLength({ min: 1, max: 60 })
	.withMessage('Subject must have between 1 and 60 characters')

const validateMessageBody = check('message')
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage('500 maximum characters')
	.bail()
	.isString()
	.withMessage('Can only contain letters and numbers')

export {
	validateEmail,
	validateEmailDuplicate,
	validatePassword,
	validateUsername,
	validatePasswordConfirmation,
	validatePasswordCurrent,
	validatePasswordNew,
	validatePasswordNewConfirmation,
	validateMessageRecipient,
	validateMessageSubject,
	validateMessageBody
}
