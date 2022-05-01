import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'
import {
	bggGetGamesDetails,
	bggGetHotGamesList,
	bggGetGallery,
	bggSearchGame,
	getBggReccomendations,
	getBggVideos,
	submitReport,
	getBggNewReleases,
	getBggCrowdfundingCampaigns
} from '../controllers/miscController.js'
import {
	validateReportType,
	validateReportText,
	validateReportUsername,
	validateReportGameAltId
} from '../validators/miscValidator.js'

// @route /api/misc
router
	.route('/report')
	.post(
		[ protect, validateReportType, validateReportText, validateReportUsername, validateReportGameAltId ],
		submitReport
	)
router.route('/bgg/games').get(protect, bggGetGamesDetails)
router.route('/bgg/search').get(protect, bggSearchGame)
router.route('/bgg/hot').get(protect, bggGetHotGamesList)
router.route('/bgg/gallery').get(protect, bggGetGallery)
router.route('/bgg/recommendations').get(protect, getBggReccomendations)
router.route('/bgg/videos').get(protect, getBggVideos)
router.route('/bgg/releases').get(protect, getBggNewReleases)
router.route('/bgg/crowdfunding').get(protect, getBggCrowdfundingCampaigns)

export default router
