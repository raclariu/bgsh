import asyncHandler from 'express-async-handler'
import Notification from '../models/notificationModel.js'

// ~ @desc    Get notifications
// ~ @route   GET /api/notifications
// ~ @access  Private route
const getNotifications = asyncHandler(async (req, res) => {
	const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).lean()

	res.status(200).json({ notifications })
})

// ! @desc    Delete one notification
// ! @route   DELETE  /api/notifications
// ! @access  Private route
const deleteOneNotification = asyncHandler(async (req, res) => {
	const { ntfId } = req.body

	await Notification.deleteOne({ _id: ntfId })

	const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).lean()

	res.status(200).json({ notifications })
})

// ! @desc    Delete all notifications
// ! @route   DELETE  /api/notifications/clear
// ! @access  Private route
const clearAllNotifications = asyncHandler(async (req, res) => {
	await Notification.deleteMany({ recipient: req.user._id })

	res.status(204).end()
})

export { getNotifications, deleteOneNotification, clearAllNotifications }
