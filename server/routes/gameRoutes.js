import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import { uploadGameImage, resizeGameImage } from '../middlewares/imagesMiddleware.js'
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
	reactivateGame,
	uploadImage,
	deleteImage,
	getNewListings
} from '../controllers/gamesController.js'
import { sellValidators, tradeValidators, wantValidators } from '../validators/listGameValidator.js'

// @route /api/games
router.route('/').get(protect, getGames)
router.route('/:id/delete').delete(protect, deleteOneGame)
router.route('/:id/reactivate').patch(protect, reactivateGame)
router.route('/user/listed').get(protect, getUserListedGames)
router.route('/new').get(getNewListings)
router.route('/saved').get(protect, getSavedGames)
router.route('/:altId').get(protect, getSingleGame)
router.route('/:altId/save').get(protect, getSingleGameSavedStatus).patch(protect, switchSaveGame)
router.route('/wanted').post([ protect, ...wantValidators ], listWantedGames)
router.route('/trade').post([ protect, ...tradeValidators ], listTradeGames)
router.route('/sell').post([ protect, ...sellValidators ], listSaleGames)
router.route('/images').post([ protect, uploadGameImage, resizeGameImage ], uploadImage).delete(protect, deleteImage)

export default router
