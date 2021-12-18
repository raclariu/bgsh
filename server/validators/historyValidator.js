import { check } from 'express-validator'
import User from '../models/userModel.js'

const validateSingleUsername = check('otherUsername')
	.optional({ nullable: true })
	.trim()
	.isLength({ max: 20 })
	.withMessage('Username must have between 4 and 20 characters')
	.bail()
	.custom(async (otherUsername, { req }) => {
		if (!otherUsername) {
			return true
		}

		if (otherUsername === req.user.username) {
			throw new Error('You cannot use your own username')
		}

		if (otherUsername) {
			const otherUsernameExists = await User.findOne({ username: otherUsername }).select('_id username').lean()

			if (!otherUsernameExists) {
				throw new Error('User not found')
			} else {
				return true
			}
		}
	})

const validateMultipleUsernames = check('games.*.otherUsername')
	.optional({ nullable: true })
	.trim()
	.isLength({ max: 20 })
	.withMessage('Username must have between 4 and 20 characters')
	.bail()
	.custom(async (otherUsername, { req }) => {
		if (!otherUsername) {
			return true
		}

		if (otherUsername === req.user.username) {
			throw new Error('You cannot use your own username')
		}

		if (otherUsername) {
			const otherUsernameExists = await User.findOne({ username: otherUsername }).select('_id username').lean()

			if (!otherUsernameExists) {
				throw new Error('User not found')
			} else {
				return true
			}
		}
	})

const validateSinglePrice = check('finalPrice')
	.optional({ nullable: true })
	.isInt()
	.withMessage('Final price must be a number')
	.custom((finalPrice) => {
		if (finalPrice >= 0 && finalPrice <= 10000) {
			return true
		} else {
			throw new Error('Invalid price. Should be between 0 and 10000 RON')
		}
	})

const validateMultiplePrices = check('games.*.price')
	.optional({ nullable: true })
	.isInt()
	.withMessage('Final price must be a number')
	.custom((finalPrice) => {
		if (finalPrice >= 0 && finalPrice <= 10000) {
			return true
		} else {
			throw new Error('Invalid price. Should be between 0 and 10000 RON')
		}
	})

const validateExtraInfoPack = check('extraInfoPack')
	.optional({ nullable: true })
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage('500 maximum characters')
	.bail()
	.isString()
	.withMessage('Can only contain letters and numbers')

const validateMultipleExtraInfos = check('games.*.extraInfo')
	.optional({ nullable: true })
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage('500 maximum characters')
	.bail()
	.isString()
	.withMessage('Can only contain letters and numbers')

export {
	validateSingleUsername,
	validateMultipleUsernames,
	validateSinglePrice,
	validateMultiplePrices,
	validateExtraInfoPack,
	validateMultipleExtraInfos
}
