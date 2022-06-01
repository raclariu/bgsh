import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import { uploadGameImage, resizeGameImage } from '../middlewares/imagesMiddleware.js'
import {
    listSaleGames,
    listTradeGames,
    listWantedGames,
    editSaleGame,
    editTradeGame,
    editWantedGame,
    getGames,
    getUserListedGames,
    getSingleGame,
    switchSaveGame,
    getSavedGames,
    getSingleGameSavedStatus,
    deleteSavedGame,
    deleteOneGame,
    reactivateGame,
    uploadImage,
    deleteImage,
    getNewListings
} from '../controllers/gamesController.js'
import {
    sellValidators,
    tradeValidators,
    wantedValidators,
    sellEditValidators,
    tradeEditValidators,
    wantedEditValidators
} from '../validators/listGameValidator.js'

// @route /api/games
router.route('/').get(getGames)
router.route('/:id/delete').delete(protect, deleteOneGame)
router.route('/:id/reactivate').patch(protect, reactivateGame)
router.route('/user/listed').get(protect, getUserListedGames)
router.route('/new').get(getNewListings)
router.route('/saved').get(protect, getSavedGames)
router.route('/:altId').get(getSingleGame)
router
    .route('/:altId/save')
    .get(protect, getSingleGameSavedStatus)
    .patch(protect, switchSaveGame)
    .delete(protect, deleteSavedGame)
router.route('/wanted').post([protect, ...wantedValidators], listWantedGames)
router.route('/trade').post([protect, ...tradeValidators], listTradeGames)
router.route('/sell').post([protect, ...sellValidators], listSaleGames)
router.route('/sell/:id/edit').patch([protect, ...sellEditValidators], editSaleGame)
router.route('/trade/:id/edit').patch([protect, ...tradeEditValidators], editTradeGame)
router.route('/wanted/:id/edit').patch([protect, ...wantedEditValidators], editWantedGame)
router.route('/images').post([protect, uploadGameImage, resizeGameImage], uploadImage).delete(protect, deleteImage)

export default router
