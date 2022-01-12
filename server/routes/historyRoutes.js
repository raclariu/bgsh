import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import {
	addSoldGamesToHistory,
	addTradedGamesToHistory,
	addBoughtGamesToHistory,
	getGamesHistory
} from '../controllers/historyController.js'
import { sellValidators, tradeValidators, buyValidators } from '../validators/historyValidator.js'

// @route /api/history
router.route('/').get(protect, getGamesHistory)
router.route('/sell').post([ protect, ...sellValidators ], addSoldGamesToHistory)
router.route('/trade').post([ protect, ...tradeValidators ], addTradedGamesToHistory)
router.route('/buy').post([ protect, ...buyValidators ], addBoughtGamesToHistory)

export default router
