import express from 'express'
const router = express.Router()
import {
	updateBggCollection,
	getOwned,
	getForTrade,
	getWantInTrade,
	getWantToBuy,
	getWantToPlay,
	getWishlist
} from '../controllers/collectionController.js'
import { protect } from '../middlewares/authMiddleware.js'

// @route /api/collections
router.route('/').post(protect, updateBggCollection)
router.route('/owned').get(protect, getOwned)
router.route('/fortrade').get(protect, getForTrade)
router.route('/wantintrade').get(protect, getWantInTrade)
router.route('/wanttobuy').get(protect, getWantToBuy)
router.route('/wanttoplay').get(protect, getWantToPlay)
router.route('/wishlist').get(protect, getWishlist)

export default router
