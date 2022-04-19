import { check } from 'express-validator'
import User from '../models/userModel.js'
import { comparePasswords } from '../helpers/helpers.js'

const validateEmail = check('email')
	.trim()
	.notEmpty()
	.withMessage('Email is required')
	.bail()
	.normalizeEmail({ gmail_remove_dots: false })
	.isEmail()
	.withMessage('Invalid email address')
	.bail()
	.custom(async (email) => {
		const userExists = await User.findOne({ email }).select('_id status').lean()

		if (!userExists) {
			throw new Error('User with this email address does not exist')
		} else {
			if (userExists.status === 'banned') {
				throw new Error('User is banned')
			}

			return true
		}
	})

const validateEmailDuplicate = check('email')
	.trim()
	.notEmpty()
	.withMessage('Email is required')
	.bail()
	.normalizeEmail({ gmail_remove_dots: false })
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

const validatePasswordLogIn = check('password')
	.trim()
	.notEmpty()
	.withMessage('Password is required')
	.bail()
	.isLength({ min: 6 })
	.withMessage('Password must be longer than 6 characters')
	.bail()
	.isLength({ max: 64 })
	.withMessage('Password must be shorter than 64 characters')
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

const validatePasswordSignUp = check('password')
	.trim()
	.notEmpty()
	.withMessage('Password is required')
	.bail()
	.isLength({ min: 8 })
	.withMessage('Password must be longer than 8 characters')
	.bail()
	.isLength({ max: 64 })
	.withMessage('Password must be shorter than 64 characters')
	.bail()
	.matches(/^.*[A-Z].*$/)
	.withMessage('Password should contain at least one uppercase letter')
	.bail()
	.matches(/^.*[a-z].*$/)
	.withMessage('Password should contain at least one lowercase letter')
	.bail()
	.matches(/^.*[0-9].*$/)
	.withMessage('Password should contain at least one number')

const validatePasswordConfirmation = check('passwordConfirmation')
	.trim()
	.notEmpty()
	.withMessage('Password confirmation is required')
	.bail()
	.isLength({ min: 8 })
	.withMessage('Password confirmation must be longer than 8 characters')
	.bail()
	.isLength({ max: 64 })
	.withMessage('Password confirmation must be shorter than 64 characters')
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
	.not()
	.isIn([ 'admin', 'administrator', 'owner', 'claudiu', 'rakla', 'meeple', 'admiin', 'axtro' ])
	.withMessage('Username not allowed')
	.bail()
	.custom(async (username) => {
		const usernameExists = await User.findOne({ username }).select('_id').lean()
		if (usernameExists) {
			throw new Error(`Username '${username}' already taken`)
		} else {
			return true
		}
	})

const validateUsernameExist = check('username')
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
		const usernameExists = await User.findOne({ username }).select('_id').lean()

		if (!usernameExists) {
			throw new Error(`User '${username}' not found`)
		} else {
			req.userId = usernameExists

			return true
		}
	})

const validatePasswordCurrent = check('passwordCurrent')
	.trim()
	.notEmpty()
	.withMessage('Current password is required')
	.bail()
	.isLength({ min: 8 })
	.withMessage('Password must be longer than 8 characters')
	.bail()
	.isLength({ max: 64 })
	.withMessage('Password must be shorter than 64 characters')
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

const validateResetPasswordNew = check('passwordNew')
	.trim()
	.notEmpty()
	.withMessage('New password is required')
	.bail()
	.isLength({ min: 8 })
	.withMessage('New password must be longer than 8 characters')
	.bail()
	.isLength({ max: 64 })
	.withMessage('New password must be shorter than 64 characters')

const validatePasswordNew = check('passwordNew')
	.trim()
	.notEmpty()
	.withMessage('New password is required')
	.bail()
	.isLength({ min: 8 })
	.withMessage('New password must be longer than 8 characters')
	.bail()
	.isLength({ max: 64 })
	.withMessage('New password must be shorter than 64 characters')
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
	.isLength({ min: 8 })
	.withMessage('New password confirmation must be longer than 8 characters')
	.bail()
	.isLength({ max: 64 })
	.withMessage('New password confirmation must be shorter than 64 characters')
	.bail()
	.custom((passwordNewConfirmation, { req }) => {
		return passwordNewConfirmation.toLowerCase() === req.body.passwordNew.toLowerCase()
	})
	.withMessage('New password confirmation does not match new password')

const validateSocialsBggUsername = check('bggUsername')
	.optional({ nullable: true })
	.trim()
	.isLength({ min: 4, max: 20 })
	.withMessage('BGG username must be between 4 and 20 characters long')
	.bail()

const validateSocialsFbgUsername = check('fbgUsername')
	.optional({ nullable: true })
	.trim()
	.isLength({ min: 5, max: 20 })
	.withMessage('FBG username must be between 5 and 20 characters long')
	.bail()

const validateSocialsShow = check('show')
	.isIn([ true, false ])
	.withMessage('Invalid socials display checkbox selection')

const validateLogin = [ validateEmail, validatePasswordLogIn ]
const validateSignUp = [
	validateEmailDuplicate,
	validateUsername,
	validatePasswordSignUp,
	validatePasswordConfirmation
]
const validatePasswordChange = [ validatePasswordCurrent, validatePasswordNew, validatePasswordNewConfirmation ]
const validateSocials = [ validateSocialsBggUsername, validateSocialsFbgUsername, validateSocialsShow ]

export {
	validateLogin,
	validateSignUp,
	validatePasswordChange,
	validateUsernameExist,
	validateEmail,
	validateResetPasswordNew,
	validatePasswordNewConfirmation,
	validateSocials
}
