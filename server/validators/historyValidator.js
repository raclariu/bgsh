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

const validateMultiplePrices = check('games.*.price')
	.if((value, { req }) => !req.body.isPack)
	.isInt({ min: 0, max: 10000 })
	.withMessage('Price must be a number between 0 and 10000')
	.bail()
	.toInt()

const validateSinglePrice = check('finalPrice')
	.if((value, { req }) => req.body.isPack)
	.isInt({ min: 0, max: 10000 })
	.withMessage('Price must be a number between 0 and 10000')
	.bail()
	.toInt()

const validateMultipleExtraInfos = check('games.*.extraInfo')
	.optional({ nullable: true })
	.trim()
	.if((value, { req }) => !req.body.isPack)
	.isLength({ min: 0, max: 500 })
	.withMessage('0-500 character allowed')
	.bail()
	.isString()
	.withMessage('Can only contain letters and numbers')

const validateExtraInfoPack = check('extraInfoPack')
	.optional({ nullable: true })
	.trim()
	.if((value, { req }) => req.body.isPack)
	.isLength({ min: 0, max: 500 })
	.withMessage('0-500 character allowed')
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
