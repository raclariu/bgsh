import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import { addGamesToHistory, getGamesHistory } from '../controllers/historyController.js'
import { validateUsername } from '../validators/historyValidator.js'

// @route /api/history
router.route('/').post([ protect, validateUsername ], addGamesToHistory).get(protect, getGamesHistory)

export default router
