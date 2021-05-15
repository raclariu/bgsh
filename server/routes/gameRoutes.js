import express from 'express'
const router = express.Router()
import { getOneGameFromBGG } from '../controllers/gamesController.js'
import { protect } from '../middlewares/authMiddleware.js'

router.route('/bgg').post(protect, getOneGameFromBGG)

export default router
