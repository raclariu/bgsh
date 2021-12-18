import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import { addGamesToHistory, getGamesHistory } from '../controllers/historyController.js'
import {
	validateSingleUsername,
	validateMultipleUsernames,
	validateSinglePrice,
	validateMultiplePrices,
	validateExtraInfoPack,
	validateMultipleExtraInfos
} from '../validators/historyValidator.js'

// @route /api/history
router
	.route('/')
	.post(
		[
			protect,
			validateSingleUsername,
			validateMultipleUsernames,
			validateSinglePrice,
			validateMultiplePrices,
			validateExtraInfoPack,
			validateMultipleExtraInfos
		],
		addGamesToHistory
	)
	.get(protect, getGamesHistory)

export default router
