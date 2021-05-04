import express from 'express'
const router = express.Router()
import { getCollectionFromBGG, getCollectionFromDB } from '../controllers/collectionController.js'
import { protect } from '../middlewares/authMiddleware.js'
import { validateBggUsername } from '../validators/collectionValidators.js'

// @route /api/collections
router.route('/').post(protect, [ validateBggUsername ], getCollectionFromBGG).get(protect, getCollectionFromDB)

export default router
