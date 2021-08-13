import express from 'express'
const router = express.Router()
import {
	getGamesFromBGG,
	bggSearchGame,
	bggGetHotGames,
	bggGetGallery,
	sellGames,
	tradeGames,
	getGames,
	getUserActiveGames,
	getSingleGame,
	switchSaveGame,
	getSavedGames,
	getSingleSavedGame,
	deleteGame,
	reactivateGame
} from '../controllers/gamesController.js'
import { protect } from '../middlewares/authMiddleware.js'
import {
	validateType,
	validateGameVersion,
	validateGameCondition,
	validateIsSleeved,
	validateGamePrice,
	validateGameTotalPrice,
	validateExtraInfoTxt,
	validateExtraInfoPackTxt,
	validateShippingMethod,
	validateShipCities
} from '../validators/sellGameValidator.js'

router.route('/').get(protect, getGames)
router.route('/delete/:id').delete(protect, deleteGame)
router.route('/user/:id').get(protect, getUserActiveGames)
router.route('/saved').get(protect, getSavedGames).post(protect, switchSaveGame)
router.route('/saved/:altId').get(protect, getSingleSavedGame)
router.route('/reactivate/:id').patch(protect, reactivateGame)
router.route('/:altId').get(protect, getSingleGame)
router.route('/bgg').post(protect, getGamesFromBGG)
router.route('/bgg/search').post(protect, bggSearchGame)
router.route('/bgg/hot').get(bggGetHotGames)
router.route('/bgg/:bggId/images').get(protect, bggGetGallery)
router
	.route('/trade')
	.post(
		[
			protect,
			validateType,
			validateGameVersion,
			validateGameCondition,
			validateIsSleeved,
			validateExtraInfoTxt,
			validateExtraInfoPackTxt,
			validateShippingMethod,
			validateShipCities
		],
		tradeGames
	)
router
	.route('/sell')
	.post(
		[
			protect,
			validateType,
			validateGameVersion,
			validateGameCondition,
			validateIsSleeved,
			validateGamePrice,
			validateGameTotalPrice,
			validateExtraInfoTxt,
			validateExtraInfoPackTxt,
			validateShippingMethod,
			validateShipCities
		],
		sellGames
	)

export default router
