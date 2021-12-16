import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import { addGamesToHistory, getGamesHistory } from '../controllers/historyController.js'
import { validateUsername, validateFinalPrice, validateExtraInfoTxt } from '../validators/historyValidator.js'

// @route /api/history
router
	.route('/')
	.post([ protect, validateUsername, validateFinalPrice, validateExtraInfoTxt ], addGamesToHistory)
	.get(protect, getGamesHistory)

export default router
