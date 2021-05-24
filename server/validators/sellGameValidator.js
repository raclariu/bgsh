import { check } from 'express-validator'
import { body } from 'express-validator'

const validateExtraInfoTxt = check('extraInfoTxt')
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage('500 maximum characters')
	.bail()
	.isString()
	.withMessage('Can only contain letters and numbers')

const validateSellType = check('sellType')
	.trim()
	.isIn([ 'individual', 'pack' ])
	.withMessage('You can only sell games individually or as a pack')

const validateIsSleeved = check('games.*.isSleeved').isBoolean().withMessage('Sleeved option error')

const validateGameVersion = check('games').custom((games, { req }) => {
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
})

const validateGameCondition = check('games').custom((games, { req }) => {
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
})

const validateGamePrice = check('games').custom((games, { req }) => {
	for (let i = 0; i < req.body.games.length; i++) {
		const priceOk = games[i].price > 0

		if (!priceOk) {
			throw new Error(`Invalid price for ${games[i].title}`)
		}
	}
	return true
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
	validateSellType,
	validateGameVersion,
	validateGameCondition,
	validateIsSleeved,
	validateGamePrice,
	validateExtraInfoTxt,
	validateShippingMethod,
	validateShipCities
}
