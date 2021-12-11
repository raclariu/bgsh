import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import {
	bggGetGamesDetails,
	bggGetHotGamesList,
	bggGetGallery,
	bggSearchGame,
	getKickstarters
} from '../controllers/miscController.js'

// @route /api/misc
router.route('/kickstarters').get(getKickstarters)
router.route('/bgg/games').get(protect, bggGetGamesDetails)
router.route('/bgg/search').get(protect, bggSearchGame)
router.route('/bgg/hot').get(bggGetHotGamesList)
router.route('/bgg/gallery').get(protect, bggGetGallery)

export default router
