import { check } from 'express-validator'
import User from '../models/userModel.js'

// (*) Validation for single username @ sell,trade - done
const validateSingleUsername = check('otherUsername')
	.optional({ nullable: true })
	.trim()
	.isString()
	.withMessage('Invalid username')
	.bail()
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

// (*) Validation for pack single username @ buy - done
const validateBuySingleUsername = check('otherUsername')
	.optional({ nullable: true })
	.if((value, { req }) => req.body.isPack)
	.trim()
	.isString()
	.withMessage('Invalid username')
	.bail()
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

// (*) Validation for multiple usernames @ buy - done
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

			if (otherUsername.toLowerCase() === req.user.username.toLowerCase()) {
				throw {
					message : `You cannot use your own username for ${req.body.games[idx].title}`
				}
			}

			if (otherUsername) {
				const otherUsernameExists = await User.findOne({ username: otherUsername })
					.select('_id username')
					.lean()

				if (!otherUsernameExists) {
					throw {
						message : `Invalid username "${otherUsername} for ${req.body.games[idx].title}`
					}
				} else {
					return true
				}
			}
		} catch (error) {
			throw new Error(error.message ? error.message : 'Username error. Check usernames and resubmit')
		}
	})

// (*) Validation for multiple games prices @ buy - done
const validateBuyMultiplePrices = check('games.*.price')
	.if((value, { req }) => !req.body.isPack) // if pack is false, continue
	.isInt({ min: 0, max: 10000 })
	.withMessage((value, { req, path }) => {
		try {
			const idx = path.split('[')[1].split(']')[0]
			return `Invalid price "${value}" for ${req.body.games[idx].title}. Must be between 0 and 10000 RON`
		} catch (error) {
			return 'Price error. Must be between 0 and 10000 RON'
		}
	})
	.bail()
	.toInt()

// (*) Validation for pack final price @ sell - done
const validateSinglePrice = check('finalPrice')
	.isInt({ min: 0, max: 10000 })
	.withMessage('Price must be a number between 0 and 10000ss')
	.bail()
	.toInt()

// (*) Validation for pack final price @ buy - done
const validateBuyPackPrice = check('finalPrice')
	.if((value, { req }) => req.body.isPack)
	.isInt({ min: 0, max: 10000 })
	.withMessage('Pack price must be a whole number between 0 and 10000')
	.bail()
	.toInt()

// (*) Validation for games extra info text @ buy - done
const validateBuyMultipleExtraInfos = check('games.*.extraInfo')
	.optional({ nullable: true })
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage((value, { req, path }) => {
		try {
			const idx = path.split('[')[1].split(']')[0]
			return `Invalid extra info for ${req.body.games[idx].title}. Only 0-500 character allowed`
		} catch (error) {
			return '0-500 character allowed'
		}
	})

// (*) Validation for pack extra info text @ buy - done
const validateBuyExtraInfoPack = check('extraInfoPack')
	.optional({ nullable: true })
	.if((value, { req }) => req.body.isPack) // if pack is true, continue
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage('Invalid pack extra info. 0-500 character allowed')

// (*) Validation for single extra info text @ sell,trade - done
const validateExtraInfoPack = check('extraInfoPack')
	.optional({ nullable: true })
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage('Invalid pack extra info. 0-500 character allowed')

// (*) Validation for games sleeving @ buy - done
const validateBuyIsSleeved = check('games.*.isSleeved').isIn([ true, false ]).withMessage((value, { req, path }) => {
	try {
		const idx = path.split('[')[1].split(']')[0]
		return `Invalid "sleeved" option for ${req.body.games[idx].title}`
	} catch (error) {
		return 'Invalid "sleeved" option'
	}
})

// (*) Validation for games versions @ sell,trade - done
const validateBuyGameVersion = check('games.*.version')
	.custom((version, { req, path }) => {
		try {
			const idx = path.split('[')[1].split(']')[0]
			const versionOk = req.body.games[idx].versions.map((v) => v.title).includes(version.title)

			if (!versionOk) {
				throw new Error()
			}

			return true
		} catch (error) {
			return false
		}
	})
	.withMessage((value, { req, path }) => {
		try {
			const idx = path.split('[')[1].split(']')[0]
			return `Invalid version "${value.title}" for ${req.body.games[idx].title}`
		} catch (error) {
			return 'Version error. Check versions and resubmit'
		}
	})

const sellValidators = [ validateSingleUsername, validateSinglePrice, validateExtraInfoPack ]
const tradeValidators = [ validateSingleUsername, validateExtraInfoPack ]
const buyValidators = [
	validateBuyGameVersion,
	validateBuySingleUsername,
	validateBuyPackPrice,
	validateBuyMultiplePrices,
	validateBuyMultipleUsernames,
	validateBuyMultipleExtraInfos,
	validateBuyExtraInfoPack,
	validateBuyIsSleeved
]

export { sellValidators, tradeValidators, buyValidators }
