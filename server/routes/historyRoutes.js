import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import { addGamesToHistory, getSoldGamesHistory } from '../controllers/historyController.js'
import { validateUsername } from '../validators/historyValidator.js'

// @route /api/users
router.route('/add').post([ protect, validateUsername ], addGamesToHistory)
router.route('/sold').get(protect, getSoldGamesHistory)

export default router
