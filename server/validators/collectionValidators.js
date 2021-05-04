import { check } from 'express-validator'

const validateBggUsername = check('bggUsername')
	.trim()
	.notEmpty()
	.withMessage('BGG username is required')
	.bail()
	.isLength({ min: 4, max: 20 })
	.withMessage('Username must have between 4 and 20 characters')

export { validateBggUsername }
