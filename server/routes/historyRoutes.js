import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import {
	addSoldGamesToHistory,
	addTradedGamesToHistory,
	addBoughtGamesToHistory,
	getHistoryIndex,
	deleteHistoryEntry
} from '../controllers/historyController.js'
import { sellValidators, tradeValidators, buyValidators } from '../validators/historyValidator.js'

// @route /api/history
router.route('/').get(protect, getHistoryIndex)
router.route('/:id').delete(protect, deleteHistoryEntry)
router.route('/sell').post([ protect, ...sellValidators ], addSoldGamesToHistory)
router.route('/trade').post([ protect, ...tradeValidators ], addTradedGamesToHistory)
router.route('/buy').post([ protect, ...buyValidators ], addBoughtGamesToHistory)

export default router
