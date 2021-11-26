import express from 'express'
const router = express.Router()
import {
	getGamesDetailsFromBGG,
	bggSearchGame,
	bggGetHotGames,
	bggGetGallery,
	sellGames,
	tradeGames,
	addWantedGames,
	getGames,
	getWantedGames,
	getUserListedGames,
	getUserWantedGames,
	getSingleGame,
	switchSaveGame,
	getSavedGames,
	getSingleSavedGame,
	deleteGame,
	deleteWantedGame,
	reactivateGame
} from '../controllers/gamesController.js'
import { protect } from '../middlewares/authMiddleware.js'
import {
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
} from '../validators/sellGameValidator.js'
import { validatePrefShipping } from '../validators/wantedValidator.js'

// @route /api/games
router.route('/').get(protect, getGames)
router.route('/delete/:id').delete(protect, deleteGame)
router.route('/wanted/delete/:id').delete(protect, deleteWantedGame)
router.route('/user/:id/wanted').get(protect, getUserWantedGames)
router.route('/user/:id').get(protect, getUserListedGames)
router.route('/saved').get(protect, getSavedGames).post(protect, switchSaveGame)
router.route('/saved/:altId').get(protect, getSingleSavedGame)
router.route('/wanted').get(protect, getWantedGames).post([ protect, validatePrefShipping ], addWantedGames)
router.route('/reactivate/:id').patch(protect, reactivateGame)
router.route('/:altId').get(protect, getSingleGame)
router.route('/bgg').post(protect, getGamesDetailsFromBGG)
router.route('/bgg/search').post(protect, bggSearchGame)
router.route('/bgg/hot').get(bggGetHotGames)
router.route('/bgg/gallery').get(protect, bggGetGallery)
router
	.route('/trade')
	.post(
		[
			protect,
			validateIsPack,
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
		],
		sellGames
	)

export default router
