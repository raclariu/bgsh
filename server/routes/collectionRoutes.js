import express from 'express'
const router = express.Router()
import {
	getBggCollectionAndWishlist,
	getCollectionFromDB,
	getWishlistFromDB
} from '../controllers/collectionController.js'
import { protect } from '../middlewares/authMiddleware.js'

// @route /api/collections
router.route('/').post(protect, getBggCollectionAndWishlist).get(protect, getCollectionFromDB)
router.route('/wishlist').get(protect, getWishlistFromDB)

export default router
