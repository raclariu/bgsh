import express from 'express'
const router = express.Router()
import { getCollectionFromBGG, getCollectionFromDB } from '../controllers/collectionController.js'
import { protect } from '../middlewares/authMiddleware.js'

// @route /api/collections
router.route('/').post(protect, getCollectionFromBGG).get(protect, getCollectionFromDB)

export default router
