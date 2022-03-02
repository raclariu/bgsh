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

	throw {
		message : 'asd'
	}

	await Notification.findOneAndDelete({ _id: ntfId })

	const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).lean()

	res.status(200).json({ notifications })
})

export { getNotifications, deleteOneNotification }
