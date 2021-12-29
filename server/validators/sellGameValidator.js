import { check } from 'express-validator'

const validateExtraInfoTxt = check('games.*.extraInfo')
	.optional({ nullable: true })
	.if((value, { req }) => !req.body.isPack)
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage('0-500 character allowed')

const validateExtraInfoPackTxt = check('extraInfoPack')
	.optional({ nullable: true })
	.if((value, { req }) => req.body.isPack)
	.trim()
	.isLength({ min: 0, max: 500 })
	.withMessage('0-500 character allowed')

const validateIsPack = check('isPack')
	.isIn([ true, false ])
	.withMessage('You can only sell games individually or as a pack')

const validateIsSleeved = check('games.*.isSleeved').isBoolean().withMessage('Sleeved option error')

const validateGameVersion = check('games.*.version').custom((version, { req, path }) => {
	try {
		const idx = path.split('[')[1].split(']')[0]
		const versionOk = req.body.games[idx].versions.some((v) => v.title === version.title)

		if (!versionOk) {
			throw {
				message : `${req.body.games[idx].title} - Invalid version`
			}
		}

		return true
	} catch (error) {
		throw new Error(error.message ? error.message : 'Version error. Check versions and resubmit')
	}
})

const validateGameCondition = check('games.*.condition').custom((condition, { req, path }) => {
	try {
		const idx = path.split('[')[1].split(']')[0]
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
			throw {
				message : `${req.body.games[idx].title} - Invalid condition`
			}
		}

		return true
	} catch (error) {
		throw new Error(error.message ? error.message : 'Condition error. Check conditions and resubmit')
	}
})

const validateGamePrice = check('games.*.price')
	.if((value, { req }) => !req.body.isPack)
	.isInt({ min: 0, max: 10000 })
	.withMessage('Price must be a number between 0 and 10000')
	.bail()
	.toInt()

const validateGameTotalPrice = check('totalPrice')
	.if((value, { req }) => req.body.isPack)
	.isInt({ min: 0, max: 10000 })
	.withMessage('Price must be a number between 0 and 10000')
	.bail()
	.toInt()

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
	validateIsPack,
	validateGameVersion,
	validateGameCondition,
	validateIsSleeved,
	validateGamePrice,
	validateGameTotalPrice,
	validateExtraInfoTxt,
	validateExtraInfoPackTxt,
	validateShippingMethod,
	validateShipCities
}
