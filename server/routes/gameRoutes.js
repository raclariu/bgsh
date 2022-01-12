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
import { sellValidators, tradeValidators, wantValidators } from '../validators/listGameValidator.js'

// @route /api/games
router.route('/').get(protect, getGames)
router.route('/:id/delete').delete(protect, deleteOneGame)
router.route('/user/:id').get(protect, getUserListedGames)
router.route('/saved').get(protect, getSavedGames)
router.route('/:altId/save').get(protect, getSingleGameSavedStatus).patch(protect, switchSaveGame)
router.route('/:id/reactivate').patch(protect, reactivateGame)
router.route('/:altId').get(protect, getSingleGame)
router.route('/wanted').post([ protect, ...wantValidators ], listWantedGames)
router.route('/trade').post([ protect, ...tradeValidators ], listTradeGames)
router.route('/sell').post([ protect, ...sellValidators ], listSaleGames)

export default router
