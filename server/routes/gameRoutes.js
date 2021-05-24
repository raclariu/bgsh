import express from 'express'
const router = express.Router()
import { getGamesFromBGG, sellGames } from '../controllers/gamesController.js'
import { protect } from '../middlewares/authMiddleware.js'
import {
	validateSellType,
	validateGameVersion,
	validateGameCondition,
	validateIsSleeved,
	validateGamePrice,
	validateExtraInfoTxt,
	validateShippingMethod,
	validateShipCities
} from '../validators/sellGameValidator.js'

router.route('/bgg').post(protect, getGamesFromBGG)
router
	.route('/sell')
	.post(
		[
			protect,
			validateSellType,
			validateGameVersion,
			validateGameCondition,
			validateIsSleeved,
			validateGamePrice,
			validateExtraInfoTxt,
			validateShippingMethod,
			validateShipCities
		],
		sellGames
	)

export default router
