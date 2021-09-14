import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../models/userModel.js'
import Message from '../models/messageModel.js'

// * @desc    Send message
// * @route   POST  /api/messages
// * @access  Private route
const sendMessage = asyncHandler(async (req, res) => {
	const { subject, message, recipientId } = req.body

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
		const sender = await User.findOne({ _id: req.user._id }).select('messages _id username')
		const recipient = await User.findOne({ _id: recipientId }).select('messages _id username')

		if (!sender || !recipient) {
			res.status(404)
			throw {
				message : 'User not found'
			}
		}

		const msg = await Message.create({
			sender    : req.user._id,
			recipient : recipientId,
			subject,
			message
		})

		sender.messages.unshift(msg._id)
		recipient.messages.unshift(msg._id)

		await sender.save()
		await recipient.save()

		res.status(200).end()
	}
})

// ~ @desc    Get received messages
// ~ @route   GET  /api/messages/received
// ~ @access  Private route
const getReceivedMessages = asyncHandler(async (req, res) => {
	const user = await User.findOne({ _id: req.user._id }).select('messages').populate({
		path     : 'messages',
		match    : { recipient: req.user._id },
		populate : {
			path   : 'sender',
			select : '_id username'
		}
	})

	res.status(200).json(user.messages)
})

// ~ @desc    Get sent messages
// ~ @route   GET  /api/messages/sent
// ~ @access  Private route
const getSentMessages = asyncHandler(async (req, res) => {
	const user = await User.findOne({ _id: req.user._id }).select('messages').populate({
		path     : 'messages',
		match    : { sender: req.user._id },
		populate : {
			path   : 'recipient',
			select : '_id username'
		}
	})

	res.status(200).json(user.messages)
})

// ! @desc    Delete messages
// ! @route   DELETE  /api/messages/delete
// ! @access  Private route
const deleteMessages = asyncHandler(async (req, res) => {
	const { ids } = req.body

	const user = await User.findOne({ _id: req.user._id }).select('messages').lean()
	user.messages = user.messages.filter((id) => !ids.includes(id.toString()))
	await User.updateOne({ _id: req.user._id }, { messages: user.messages })

	res.status(200).end()
})

// ~ @desc    Get new messages count
// ~ @route   GET  /api/messages/new
// ~ @access  Private route
const getNewMessagesCount = asyncHandler(async (req, res) => {
	const count = await Message.countDocuments({ read: false, recipient: req.user._id })

	res.status(200).json(count)
})

export { sendMessage, getReceivedMessages, getSentMessages, getNewMessagesCount, deleteMessages }
