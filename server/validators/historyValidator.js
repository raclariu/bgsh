import { check } from 'express-validator'
import User from '../models/userModel.js'

const validateUsername = check('username')
	.trim()
	.isLength({ max: 20 })
	.withMessage('Username must have between 4 and 20 characters')
	.bail()
	.custom(async (username, { req }) => {
		if (!username) {
			return true
		}

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

const validateFinalPrice = check('finalPrice')
	.optional({ nullable: true })
	.isInt()
	.withMessage('Final price must be a number')
	.custom((finalPrice, { req }) => {
		console.log('testeeee', finalPrice)
		if (finalPrice >= 0 && finalPrice <= 10000) {
			return true
		} else {
			throw new Error('Invalid price. Should be between 0 and 10000 RON')
		}
	})

const validateExtraInfoTxt = check('extraInfo')
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage('500 maximum characters')
	.bail()
	.isString()
	.withMessage('Can only contain letters and numbers')

export { validateUsername, validateFinalPrice, validateExtraInfoTxt }
