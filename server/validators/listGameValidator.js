import { check, body } from 'express-validator'

// (*) Validation for games versions @ sell,trade - done
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

// (*) Validation for games conditions @ sell,trade - done
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

// (*) Validation for games extra info text @ sell,trade - done
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

// (*) Validation for pack extra info text @ sell,trade - done
const validateExtraInfoPackTxt = check('extraInfoPack')
	.optional({ nullable: true })
	.if((value, { req }) => req.body.isPack) // if pack is true, continue
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage('Invalid pack extra info. Only 0-500 character allowed')

// (*) Validation for games sleeving @ sell,trade - done
const validateIsSleeved = check('games.*.isSleeved').isIn([ true, false ]).withMessage((value, { req, path }) => {
	try {
		const idx = path.split('[')[1].split(']')[0]
		return `Invalid "sleeved" option for ${req.body.games[idx].title}`
	} catch (error) {
		return 'Invalid "sleeved" option'
	}
})

// (*) Validation if pack @ sell,trade - done
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

// (*) Validation for shipping method @ sell,trade - done
const validateShippingMethod = body()
	.custom((data) => {
		if (!(data.shipPost || data.shipCourier || data.shipPersonal)) {
			throw new Error()
		} else {
			return true
		}
	})
	.withMessage('Select at least one shipping method')

// (*) Validation for shipping cities @ sell,trade - done
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

export { sellValidators, tradeValidators, wantValidators }
