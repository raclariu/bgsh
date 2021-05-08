import express from 'express'
const router = express.Router()
import { getCollectionFromBGG, getCollectionFromDB, getBoardgameFromBGG } from '../controllers/bggController.js'
import { protect } from '../middlewares/authMiddleware.js'

// @route /api/collections
router.route('/').post(protect, getCollectionFromBGG).get(protect, getCollectionFromDB)
router.route('/:bggId').get(protect, getBoardgameFromBGG)

export default router
