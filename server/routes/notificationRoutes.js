import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'

import { getNotifications, deleteOneNotification } from '../controllers/notificationController.js'

// @route /api/notifications
router.route('/').get(protect, getNotifications).delete(protect, deleteOneNotification)

export default router
