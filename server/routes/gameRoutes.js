import express from 'express'
const router = express.Router()
import {
	listSaleGames,
	listTradeGames,
	listWantedGames,
	getGames,
	getUserListedGames,
	getSingleGame,
	switchSaveGame,
	getSavedGames,
	getSingleGameSavedStatus,
	deleteOneGame,
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
router.route('/:id/delete').delete(protect, deleteOneGame)
router.route('/user/:id').get(protect, getUserListedGames)
router.route('/saved').get(protect, getSavedGames)
router.route('/:altId/save').get(protect, getSingleGameSavedStatus).patch(protect, switchSaveGame)
router.route('/:id/reactivate').patch(protect, reactivateGame)
router.route('/:altId').get(protect, getSingleGame)
router.route('/wanted').post([ protect, validatePrefShipping ], listWantedGames)
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
		listTradeGames
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
		listSaleGames
	)

export default router
