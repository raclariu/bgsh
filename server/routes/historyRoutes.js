import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import {
	addSoldGamesToHistory,
	addTradedGamesToHistory,
	addBoughtGamesToHistory,
	getGamesHistory
} from '../controllers/historyController.js'
import {
	validateSingleUsername,
	validateBuySingleUsername,
	validateBuyMultipleUsernames,
	validateSinglePrice,
	validateBuySinglePrice,
	validateBuyMultiplePrices,
	validateExtraInfoPack,
	validateBuyMultipleExtraInfos,
	validateSingleExtraInfo
} from '../validators/historyValidator.js'

// @route /api/history
router.route('/').get(protect, getGamesHistory)
router
	.route('/sell')
	.post([ protect, validateSingleUsername, validateSinglePrice, validateSingleExtraInfo ], addSoldGamesToHistory)
router.route('/trade').post([ protect, validateSingleUsername, validateSingleExtraInfo ], addTradedGamesToHistory)
router
	.route('/buy')
	.post(
		[
			protect,
			validateBuySinglePrice,
			validateBuyMultiplePrices,
			validateBuySingleUsername,
			validateBuyMultipleUsernames,
			validateBuyMultipleExtraInfos,
			validateExtraInfoPack
		],
		addBoughtGamesToHistory
	)

export default router
