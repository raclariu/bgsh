import { body } from 'express-validator'

const validatePrefShipping = body().custom((games, { req }) => {
	try {
		for (let i = 0; i < games.length; i++) {
			const shippingOk =
				[ 'Romanian Post', 'Courier', 'Personal' ].filter((val) => games[i].prefShipping.includes(val)).length >
				0

			if (!shippingOk) {
				throw {
					message : `Invalid preffered shipping method for ${games[i].title}`
				}
			}
		}

		return true
	} catch (error) {
		throw new Error(error.message ? error.message : 'Condition error. Check conditions and resubmit')
	}
})

export { validatePrefShipping }
