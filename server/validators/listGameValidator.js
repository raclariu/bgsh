import { check, body } from 'express-validator'

// (*) Validation for games versions @ sell,trade,auction - done
const validateGameVersion = check('games.*.version')
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

// (*) Validation for games conditions @ sell,trade,auction - done
const validateGameCondition = check('games.*.condition')
	.custom((condition) => {
		try {
			const conditionOk = [
				'New',
				'Opened, not played',
				'Like new',
				'Very Good',
				'Good',
				'Acceptable',
				'Poor'
			].includes(condition)

			if (!conditionOk) {
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
			return `Invalid condition "${value}" for ${req.body.games[idx].title}`
		} catch (error) {
			return 'Condition error. Check conditions and resubmit'
		}
	})

// (*) Validation for games extra info text @ sell,trade,auction - done
const validateExtraInfoTxt = check('games.*.extraInfo')
	.optional({ nullable: true })
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage((value, { req, path }) => {
		try {
			const idx = path.split('[')[1].split(']')[0]
			return `Invalid extra info for ${req.body.games[idx].title}. Only 0-500 character allowed`
		} catch (error) {
			return 'Invalid extra info. Only 0-500 character allowed'
		}
	})

// (*) Validation for pack extra info text @ sell,trade,auction - done
const validateExtraInfoPackTxt = check('extraInfoPack')
	.optional({ nullable: true })
	.if((value, { req }) => req.body.isPack) // if pack is true, continue
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage('Invalid pack extra info. Only 0-500 character allowed')

// (*) Validation for games sleeving @ sell,trade,auction - done
const validateIsSleeved = check('games.*.isSleeved').isIn([ true, false ]).withMessage((value, { req, path }) => {
	try {
		const idx = path.split('[')[1].split(']')[0]
		return `Invalid "sleeved" option for ${req.body.games[idx].title}`
	} catch (error) {
		return 'Invalid "sleeved" option'
	}
})

// (*) Validation if pack @ sell,trade,auction - done
const validateIsPack = check('isPack')
	.isIn([ true, false ])
	.withMessage('You can only sell games individually or as a pack')

// (*) Validation for games prices @ sell - done
const validateGamePrice = check('games.*.price')
	.if((value, { req }) => !req.body.isPack) // if pack is false, continue
	.isInt({ min: 0, max: 10000 })
	.withMessage((value, { req, path }) => {
		try {
			const idx = path.split('[')[1].split(']')[0]
			return `Invalid price "${value} RON" for ${req.body.games[idx].title}. Must be between 0 and 10000 RON`
		} catch (error) {
			return 'Price error. Must be between 0 and 10000 RON'
		}
	})
	.bail()
	.toInt()

// (*) Validation for pack total price @ sell - done
const validateGameTotalPrice = check('totalPrice')
	.if((value, { req }) => req.body.isPack)
	.isInt({ min: 0, max: 10000 })
	.withMessage('Pack price must be a number between 0 and 10000')
	.bail()
	.toInt()

// (*) Validation for auction pack starting price @ auction - done
const validateAuctionPackStartingPrice = check('startingPrice')
	.if((value, { req }) => req.body.isPack)
	.isInt({ min: 0, max: 10000 })
	.withMessage('Pack starting price price must be a number between 0 and 10000')
	.bail()
	.toInt()

// (*) Validation for auction pack buy now price @ auction - done
const validateAuctionPackBuyNowPrice = check('buyNowPrice')
	.if((value, { req }) => req.body.isPack)
	.isInt({ min: 0, max: 10000 })
	.withMessage('Pack buy now price must be a number between 0 and 10000')
	.bail()
	.toInt()
	.custom((value, { req }) => {
		if (+value > +req.body.startingPrice) {
			return true
		} else {
			throw new Error()
		}
	})
	.withMessage('Buy now price for the pack must be higher than starting price')

// (*) Validation for individual auction end date @ auction - done
const validateAuctionEndDate = check('games.*.endDate')
	.if((value, { req }) => !req.body.isPack)
	.isIn([ '12h', '1d', '2d', '3d', '4d', '5d', '6d', '7d' ])
	.withMessage((value, { req, path }) => {
		try {
			const idx = path.split('[')[1].split(']')[0]
			return `Invalid end date for ${req.body.games[idx].title}`
		} catch (error) {
			return 'Invalid end dates. Check end dates and resubmit'
		}
	})

// (*) Validation for auction pack end date @ auction - done
const validateAuctionSnipeRule = check('games.*.snipeRule')
	.if((value, { req }) => !req.body.isPack)
	.isIn([ '0m', '5m', '10m', '15m', '20m', '25m', '30m', '35m', '40m', '45m', '50m', '55m', '60m' ])
	.withMessage((value, { req, path }) => {
		try {
			const idx = path.split('[')[1].split(']')[0]
			return `Invalid snipe rule for ${req.body.games[idx].title}`
		} catch (error) {
			return 'Invalid snipe rule. Check snipe rules and resubmit'
		}
	})

// (*) Validation for individual auction starting price @ auction - done
const validateAuctionStartingPrice = check('games.*.startingPrice')
	.if((value, { req }) => !req.body.isPack)
	.isInt({ min: 0, max: 10000 })
	.withMessage((value, { req, path }) => {
		try {
			const idx = path.split('[')[1].split(']')[0]
			return `Invalid starting price "${value} RON" for ${req.body.games[idx]
				.title}. Must be between 0 and 10000 RON`
		} catch (error) {
			return 'Starting price error. Must be between 0 and 10000 RON'
		}
	})
	.bail()
	.toInt()

// (*) Validation for individual auction buy now price @ auction - done
const validateAuctionBuyNowPrice = check('games.*.buyNowPrice')
	.if((value, { req }) => !req.body.isPack)
	.isInt({ min: 0, max: 10000 })
	.withMessage((value, { req, path }) => {
		try {
			const idx = path.split('[')[1].split(']')[0]
			return `Invalid buy now price "${value} RON" for ${req.body.games[idx]
				.title}. Must be between 0 and 10000 RON`
		} catch (error) {
			return 'Buy now price error. Must be between 0 and 10000 RON'
		}
	})
	.bail()
	.toInt()
	.custom((value, { req, path }) => {
		const idx = path.split('[')[1].split(']')[0]
		if (+value > +req.body.games[idx].startingPrice) {
			return true
		} else {
			throw new Error()
		}
	})
	.withMessage((value, { req, path }) => {
		try {
			const idx = path.split('[')[1].split(']')[0]
			return `Buy now price "${value} RON" must be higher than starting price "${req.body.games[idx]
				.startingPrice} RON" for ${req.body.games[idx].title}`
		} catch (error) {
			return 'Buy now price error. Must be between 0 and 10000 RON'
		}
	})

// (*) Validation for auction pack end date @ auction - done
const validateAuctionPackEndDate = check('endDate')
	.if((value, { req }) => req.body.isPack)
	.isIn([ '12h', '1d', '2d', '3d', '4d', '5d', '6d', '7d' ])
	.withMessage('Invalid end date for the pack')

// (*) Validation for auction pack end date @ auction - done
const validateAuctionPackSnipeRule = check('snipeRule')
	.if((value, { req }) => req.body.isPack)
	.isIn([ '0m', '5m', '10m', '15m', '20m', '25m', '30m', '35m', '40m', '45m', '50m', '55m', '60m' ])
	.withMessage('Invalid snipe rule for the pack')

// (*) Validation for shipping method @ sell,trade,auction - done
const validateShippingMethod = body()
	.custom((data) => {
		if (!(data.shipPost || data.shipCourier || data.shipPersonal)) {
			throw new Error()
		} else {
			return true
		}
	})
	.withMessage('Select at least one shipping method')

// (*) Validation for shipping cities @ sell,trade,auction - done
const validateShipCities = check('shipCities')
	.custom((shipCities, { req }) => {
		if (shipCities.length === 0 && req.body.shipPersonal) {
			throw new Error()
		} else {
			return true
		}
	})
	.withMessage('Personal shipping method is checked. Select at least one city to ship to')

// (*) Validation for preffered shipping methods @ wanted - done
const validateWantedPrefShipping = check('shipPreffered')
	.isArray({ min: 1, max: 3 })
	.withMessage('Invalid preffered shipping methods')
	.bail()
	.custom((shipPreffered) => {
		try {
			shipPreffered.forEach((ship) => {
				if (![ 'Romanian Post', 'Courier', 'Personal' ].includes(ship)) {
					throw new Error()
				}
			})
			return true
		} catch (error) {
			return false
		}
	})
	.withMessage((value) => {
		try {
			return `"${value}" is not a valid preffered shipping method`
		} catch (error) {
			return 'Preffered shipping method error. Check your shipping method selection and resubmit'
		}
	})

// (*) Validation for games preffered versions @ wanted - done
const validateWantedGameVersion = check('games.*.prefVersion')
	.custom((prefVersion, { req, path }) => {
		try {
			const idx = path.split('[')[1].split(']')[0]
			const versionOk = req.body.games[idx].versions.map((v) => v.title).includes(prefVersion.title)

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

// (*) Validation for games preffered mode @ wanted - done
const validateWantedPrefMode = check('games.*.prefMode')
	.custom((prefMode, { req, path }) => {
		console.log(prefMode)
		try {
			if (!prefMode.buy && !prefMode.trade) {
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
			return `Invalid preffered mode for ${req.body.games[idx].title}. At least one mode should be checked`
		} catch (error) {
			return 'Invalid preffered mode.'
		}
	})

const sellValidators = [
	validateGameVersion,
	validateGameCondition,
	validateIsSleeved,
	validateExtraInfoTxt,
	validateIsPack,
	validateExtraInfoPackTxt,
	validateGamePrice,
	validateGameTotalPrice,
	validateShippingMethod,
	validateShipCities
]

const auctionValidators = [
	validateGameVersion,
	validateGameCondition,
	validateIsSleeved,
	validateAuctionEndDate,
	validateAuctionSnipeRule,
	validateExtraInfoTxt,
	validateAuctionStartingPrice,
	validateAuctionBuyNowPrice,
	validateIsPack,
	validateExtraInfoPackTxt,
	validateShippingMethod,
	validateShipCities,
	validateAuctionPackEndDate,
	validateAuctionPackSnipeRule,
	validateAuctionPackStartingPrice,
	validateAuctionPackBuyNowPrice
]

const tradeValidators = [
	validateGameVersion,
	validateGameCondition,
	validateIsSleeved,
	validateExtraInfoTxt,
	validateIsPack,
	validateExtraInfoPackTxt,
	validateShippingMethod,
	validateShipCities
]

const wantValidators = [ validateWantedPrefShipping, validateWantedGameVersion, validateWantedPrefMode ]

export { sellValidators, auctionValidators, tradeValidators, wantValidators }
