import express from 'express'
const router = express.Router()
import {
	getGamesFromBGG,
	sellGames,
	bggSearchGame,
	getGames,
	getUserSaleGames,
	getSingleGame,
	saveGame,
	getSavedGames,
	getSingleSavedGame
} from '../controllers/gamesController.js'
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

router.route('/').get(protect, getGames)
router.route('/user/:id/sale').get(protect, getUserSaleGames)
router.route('/saved').get(protect, getSavedGames).post(protect, saveGame)
router.route('/saved/:altId').get(protect, getSingleSavedGame)
router.route('/:altId').get(protect, getSingleGame)
router.route('/bgg').post(protect, getGamesFromBGG)
router.route('/bgg/search').post(protect, bggSearchGame)
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
