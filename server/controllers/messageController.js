import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../models/userModel.js'
import Message from '../models/messageModel.js'

// * @desc    Send message
// * @route   POST  /api/messages
// * @access  Private route
const sendMessage = asyncHandler(async (req, res) => {
	const { subject, message, recipientUsername, recipientId } = req.body

	console.log(subject, message, recipientUsername, recipientId)

	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()

		res.status(400)
		throw {
			message : {
				recipientUsernameError : err.recipientUsername ? err.recipientUsername.msg : null,
				subjectError           : err.subject ? err.subject.msg : null,
				messageError           : err.message ? err.message.msg : null
			}
		}
	} else {
		await Message.create({
			sender    : req.user._id,
			recipient : recipientId,
			subject,
			message
		})

		res.status(200).end()
	}
})

// ~ @desc    Get messages
// ~ @route   GET  /api/messages
// ~ @access  Private route
const getAllMessages = asyncHandler(async (req, res) => {
	const sent = await Message.find({ sender: req.user._id })
		.populate({ path: 'recipient', select: '_id username' })
		.sort({ createdAt: -1 })
		.lean()
	const received = await Message.find({ recipient: req.user._id })
		.populate({ path: 'sender', select: '_id username' })
		.sort({ createdAt: -1 })
		.lean()

	res.status(200).json({ sent, received })
})

// ~ @desc    Get new messages count
// ~ @route   GET  /api/messages/new
// ~ @access  Private route
const getNewMessagesCount = asyncHandler(async (req, res) => {
	const count = await Message.countDocuments({ read: false, recipient: req.user._id })
	console.log(count)

	res.status(200).json(count)
})

export { sendMessage, getAllMessages, getNewMessagesCount }
