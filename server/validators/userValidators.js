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

export { validateEmail, validateEmailDuplicate, validatePassword, validateUsername, validatePasswordConfirmation }
