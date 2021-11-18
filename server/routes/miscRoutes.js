import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'

import { getKickstarters } from '../controllers/miscController.js'

// @route /api/misc
router.route('/kickstarters').get(getKickstarters)

export default router
