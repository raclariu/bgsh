import { check } from 'express-validator'

const validateEmail = check('email')
	.trim()
	.notEmpty()
	.withMessage('Email is required')
	.bail()
	.isEmail()
	.normalizeEmail()
	.withMessage('Invalid email address')

const validatePassword = check('password')
	.trim()
	.notEmpty()
	.withMessage('Password is required')
	.bail()
	.isLength({ min: 6 })
	.withMessage('Password must be longer than 6 characters')

const validatePasswordConfirmation = check('passwordConfirmation')
	.trim()
	.notEmpty()
	.withMessage('Password confirmation is required')
	.bail()
	.isLength({ min: 6 })
	.withMessage('Password confirmation must be longer than 6 characters')
	.bail()
	.custom((valueToCheck, { req }) => {
		return valueToCheck === req.body.password
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

export { validateEmail, validatePassword, validateUsername, validatePasswordConfirmation }
