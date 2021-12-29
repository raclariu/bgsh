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

		if (otherUsername.toLowerCase() === req.user.username.toLowerCase()) {
			throw new Error('You cannot use your own username')
		}

		if (otherUsername) {
			const otherUsernameExists = await User.findOne({ username: otherUsername }).select('_id username').lean()

			if (!otherUsernameExists) {
				throw new Error('User not found')
			} else {
				req.otherUsernameId = otherUsernameExists._id
				return true
			}
		}
	})

const validateBuySingleUsername = check('otherUsername')
	.optional({ nullable: true })
	.if((value, { req }) => req.body.isPack)
	.trim()
	.isLength({ max: 20 })
	.withMessage('Username must have between 4 and 20 characters')
	.bail()
	.custom(async (otherUsername, { req }) => {
		try {
			if (!otherUsername) {
				return true
			}

			if (otherUsername.toLowerCase() === req.user.username.toLowerCase()) {
				throw {
					message : 'You cannot use your own username'
				}
			}

			if (otherUsername) {
				const otherUsernameExists = await User.findOne({ username: otherUsername })
					.select('_id username')
					.lean()

				if (!otherUsernameExists) {
					throw {
						message : `User "${otherUsername}" not found`
					}
				} else {
					req.otherUsernameId = otherUsernameExists._id
					return true
				}
			}
		} catch (error) {
			throw new Error(error.message ? error.message : 'Username error.')
		}
	})

const validateBuyMultipleUsernames = check('games.*.otherUsername')
	.optional({ nullable: true })
	.trim()
	.isLength({ max: 20 })
	.withMessage('Username must have between 4 and 20 characters')
	.bail()
	.custom(async (otherUsername, { req, path }) => {
		try {
			if (!otherUsername) {
				return true
			}

			const idx = path.split('[')[1].split(']')[0]

			if (otherUsername === req.user.username) {
				throw {
					message : `${req.body.games[idx].title} - You cannot use your own username`
				}
			}

			if (otherUsername) {
				const otherUsernameExists = await User.findOne({ username: otherUsername })
					.select('_id username')
					.lean()

				if (!otherUsernameExists) {
					throw {
						message : `${req.body.games[idx].title} - User "${otherUsername}" not found`
					}
				} else {
					return true
				}
			}
		} catch (error) {
			throw new Error(error.message ? error.message : 'Username error. Check usernames and resubmit')
		}
	})

const validateBuyMultiplePrices = check('games.*.price')
	.if((value, { req }) => !req.body.isPack)
	.isInt({ min: 0, max: 10000 })
	.withMessage((value, { req, path }) => {
		const idx = path.split('[')[1].split(']')[0]
		return `${req.body.games[idx].title} - Price must be a number between 0 and 10000`
	})
	.bail()
	.toInt()

const validateSinglePrice = check('finalPrice')
	.isInt({ min: 0, max: 10000 })
	.withMessage('Price must be a number between 0 and 10000')
	.bail()
	.toInt()

const validateBuySinglePrice = check('finalPrice')
	.if((value, { req }) => req.body.isPack)
	.isInt({ min: 0, max: 10000 })
	.withMessage('Price must be a number between 0 and 10000')
	.bail()
	.toInt()

const validateBuyMultipleExtraInfos = check('games.*.extraInfo')
	.optional({ nullable: true })
	.if((value, { req }) => !req.body.isPack)
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage('0-500 character allowed')

const validateExtraInfoPack = check('extraInfoPack')
	.optional({ nullable: true })
	.if((value, { req }) => req.body.isPack)
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage('0-500 character allowed')

const validateSingleExtraInfo = check('extraInfo')
	.optional({ nullable: true })
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage('0-500 character allowed')

export {
	validateSingleUsername,
	validateBuySingleUsername,
	validateBuyMultipleUsernames,
	validateSinglePrice,
	validateBuyMultiplePrices,
	validateExtraInfoPack,
	validateBuyMultipleExtraInfos,
	validateSingleExtraInfo,
	validateBuySinglePrice
}
