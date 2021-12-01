import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../models/userModel.js'
import Message from '../models/messageModel.js'
import Conversation from '../models/conversationModel.js'

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
				recipientError : err.recipient ? err.recipient.msg : null,
				subjectError   : err.subject ? err.subject.msg : null,
				messageError   : err.message ? err.message.msg : null
			}
		}
	} else {
		await Message.create({
			sender    : req.user._id,
			recipient : recipientId,
			subject,
			message
		})

		res.status(204).end()
	}
})

// ~ @desc    Get received messages
// ~ @route   GET  /api/messages/received
// ~ @access  Private route
const getReceivedMessages = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const resultsPerPage = 24

	const count = await Message.countDocuments({ recipient: req.user._id, delRecipient: false })

	if (count === 0) {
		res.status(404)
		throw {
			message : 'No messages found'
		}
	}

	const receivedMessages = await Message.find({ recipient: req.user._id, delRecipient: false })
		.populate('sender', '_id username')
		.skip(resultsPerPage * (page - 1))
		.limit(resultsPerPage)
		.sort({ createdAt: -1 })
		.lean()

	if (receivedMessages.length === 0) {
		res.status(404)
		throw {
			message : 'No messages found'
		}
	}

	const pagination = {
		page         : page,
		totalPages   : Math.ceil(count / resultsPerPage),
		totalItems   : count,
		itemsPerPage : resultsPerPage
	}

	res.status(200).json({ messages: receivedMessages, pagination })
})

// ~ @desc    Get sent messages
// ~ @route   GET  /api/messages/sent
// ~ @access  Private route
const getSentMessages = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const resultsPerPage = 24

	const count = await Message.countDocuments({ sender: req.user._id, delSender: false })

	if (count === 0) {
		res.status(404)
		throw {
			message : 'No sent messages found'
		}
	}

	const sentMessages = await Message.find({ sender: req.user._id, delSender: false })
		.populate('recipient', '_id username')
		.skip(resultsPerPage * (page - 1))
		.limit(resultsPerPage)
		.sort({ createdAt: -1 })
		.lean()

	if (sentMessages.length === 0) {
		res.status(404)
		throw {
			message : 'No sent messages found'
		}
	}

	const pagination = {
		page         : page,
		totalPages   : Math.ceil(count / resultsPerPage),
		totalItems   : count,
		itemsPerPage : resultsPerPage
	}

	res.status(200).json({ messages: sentMessages, pagination })
})

// <> @desc    Update message status
// <> @route   PATCH /api/messages/update/:id
// <> @access  Private route
const updateMessageStatus = asyncHandler(async (req, res) => {
	const { id } = req.params

	const messageExists = await Message.findById(id).select('_id read')

	if (messageExists) {
		if (messageExists.read) {
			res.status(204).end()
		} else {
			await Message.updateOne({ _id: id }, { read: true })
			res.status(204).end()
		}
	} else {
		res.status(404)
		throw {
			message : 'Message not found'
		}
	}
})

// <> @desc    Delete messages
// <> @route   PATCH  /api/messages/delete
// <> @access  Private route
const deleteMessages = asyncHandler(async (req, res) => {
	const { ids, type } = req.body

	console.log(ids, type)

	if (type === 'received') {
		await Message.updateMany({ _id: { $in: ids } }, { delRecipient: true })
	}
	if (type === 'sent') {
		await Message.updateMany({ _id: { $in: ids } }, { delSender: true })
	}

	res.status(204).end()
})

// ~ @desc    Get new messages count
// ~ @route   GET  /api/messages/new
// ~ @access  Private route
const getNewMessagesCount = asyncHandler(async (req, res) => {
	const count = await Message.countDocuments({ read: false, recipient: req.user._id, delRecipient: false })

	res.status(200).json(count)
})

// ~ @desc    Get conversations
// ~ @route   GET  /api/messages/conversations
// ~ @access  Private route
const getConversations = asyncHandler(async (req, res) => {
	const { _id: userId } = req.user

	let conversations = await Conversation.find({ participants: { $in: userId } })
		.populate({
			path   : 'participants',
			select : '_id username'
		})
		.select('participants')
		.lean()

	const messages = await Message.find(
		{ convId: { $in: conversations.map((conv) => conv._id) }, read: false, sender: { $nin: userId } },
		'_id convId'
	)

	let arr = []
	conversations.forEach((conv) => {
		const unreadCount = messages.filter((msg) => msg.convId.toString() === conv._id.toString()).length
		arr.push({
			_id          : conv._id,
			participants : conv.participants,
			unreadCount
		})
	})

	const sorted = arr.sort((a, b) => b.unreadCount - a.unreadCount)

	res.status(200).json(sorted)
})

// ~ @desc    Get messages for one single conversation
// ~ @route   GET  /api/messages/conversations/:id
// ~ @access  Private route
const getSingleConversation = asyncHandler(async (req, res) => {
	const { id } = req.params
	const page = +req.query.page
	const resultsPerPage = 24

	const count = await Message.countDocuments({ convId: id })

	const messages = await Message.find({ convId: id })
		.sort({ createdAt: -1 })
		.skip(resultsPerPage * (page - 1))
		.limit(resultsPerPage)
		.lean()

	const pagination = {
		page         : page,
		totalPages   : Math.ceil(count / resultsPerPage),
		totalItems   : count,
		itemsPerPage : resultsPerPage
	}

	res.status(200).json({ messages, pagination })
})

// * @desc    Add message to conversation
// * @route   POST  /api/messages/conversations/:id
// * @access  Private route
const addMessageToConversation = asyncHandler(async (req, res) => {
	const { id } = req.params
	const { text } = req.body
	const { _id: userId } = req.user

	const message = Message.create({
		message : text,
		sender  : userId,
		convId  : id
	})

	if (message) {
		res.end()
	} else {
		res.status(500)
		throw {
			message : 'Error. Please try again'
		}
	}
})

export {
	sendMessage,
	getReceivedMessages,
	getSentMessages,
	getNewMessagesCount,
	deleteMessages,
	updateMessageStatus,
	getConversations,
	addMessageToConversation,
	getSingleConversation
}
