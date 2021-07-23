import { check } from 'express-validator'

const validateExtraInfoTxt = check('games.*.extraInfoTxt')
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage('500 maximum characters')
	.bail()
	.isString()
	.withMessage('Can only contain letters and numbers')

const validateType = check('type')
	.trim()
	.isIn([ 'individual', 'pack' ])
	.withMessage('You can only sell games individually or as a pack')

const validateIsSleeved = check('games.*.isSleeved').isBoolean().withMessage('Sleeved option error')

const validateGameVersion = check('games').custom((games, { req }) => {
	try {
		for (let i = 0; i < req.body.games.length; i++) {
			const versionOk = games
				.map((game) => game.versions)
				[i].map((v) => v.title)
				.find((title) => title === games[i].version.title)

			if (!versionOk) {
				throw new Error(`Invalid version for ${games[i].title}`)
			}
		}
		return true
	} catch (error) {
		throw new Error('Version error. Check versions and resubmit')
	}
})

const validateGameCondition = check('games').custom((games, { req }) => {
	try {
		for (let i = 0; i < req.body.games.length; i++) {
			const conditionOk = [
				'New',
				'Opened, not played',
				'Like new',
				'Very Good',
				'Good',
				'Acceptable',
				'Poor'
			].includes(games[i].condition)

			if (!conditionOk) {
				throw new Error(`Invalid condition for ${req.body.games[i].title}`)
			}
		}
		return true
	} catch (error) {
		throw new Error('Condition error. Check conditions and resubmit')
	}
})

const validateGamePrice = check('games').custom((games, { req }) => {
	try {
		for (let i = 0; i < req.body.games.length; i++) {
			const priceOk = games[i].price > 0

			if (!priceOk) {
				throw new Error(`Invalid price for ${games[i].title}`)
			}
		}
		return true
	} catch (error) {
		throw new Error('Price error. Check prices and resubmit')
	}
})

const validateShippingMethod = check('shipPost').custom((data, { req }) => {
	const { shipPost, shipCourier, shipPersonal } = req.body
	if (!(shipPost || shipCourier || shipPersonal)) {
		throw new Error('Select at least one shipping method')
	} else {
		return true
	}
})

const validateShipCities = check('shipCities').custom((data, { req }) => {
	if (req.body.shipCities.length === 0 && req.body.shipPersonal === true) {
		throw new Error('Select at least one city to ship to')
	} else {
		return true
	}
})

export {
	validateType,
	validateGameVersion,
	validateGameCondition,
	validateIsSleeved,
	validateGamePrice,
	validateExtraInfoTxt,
	validateShippingMethod,
	validateShipCities
}
