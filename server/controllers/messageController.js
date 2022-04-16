import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Fuse from 'fuse.js'
import Message from '../models/messageModel.js'

// * @desc    Send message
// * @route   POST  /api/messages
// * @access  Private route
const sendMessage = asyncHandler(async (req, res) => {
	const { subject, message } = req.body

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
			recipient : req.recipientId,
			subject,
			message
		})

		return res.status(204).end()
	}
})

// ~ @desc    Get received messages
// ~ @route   GET  /api/messages/received
// ~ @access  Private route
const getReceivedMessages = asyncHandler(async (req, res) => {
	const search = req.query.search
	const page = +req.query.page
	const resultsPerPage = 12

	if (search) {
		const receivedList = await Message.find({ recipient: req.user._id, delRecipient: false })
			.populate('sender', '_id username avatar')
			.sort({ createdAt: -1 })
			.lean()

		const fuse = new Fuse(receivedList, {
			keys      : [ 'sender.username', 'subject' ],
			threshold : 0.3,
			distance  : 200
		})

		const results = fuse.search(search).map((msg) => msg.item)

		if (results.length === 0) {
			return res.status(200).json({
				messages : []
			})
		}

		const pagination = {
			page       : page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		return res
			.status(200)
			.json({ messages: results.slice((page - 1) * resultsPerPage, page * resultsPerPage), pagination })
	} else {
		const count = await Message.countDocuments({ recipient: req.user._id, delRecipient: false })

		if (count === 0) {
			return res.status(200).json({
				messages : []
			})
		}

		const receivedMessages = await Message.find({ recipient: req.user._id, delRecipient: false })
			.populate('sender', '_id username avatar')
			.skip(resultsPerPage * (page - 1))
			.limit(resultsPerPage)
			.sort({ createdAt: -1 })
			.lean()

		if (receivedMessages.length === 0) {
			return res.status(200).json({
				messages : []
			})
		}

		const pagination = {
			page         : page,
			totalPages   : Math.ceil(count / resultsPerPage),
			totalItems   : count,
			itemsPerPage : resultsPerPage
		}

		return res.status(200).json({ messages: receivedMessages, pagination })
	}
})

// ~ @desc    Get sent messages
// ~ @route   GET  /api/messages/sent
// ~ @access  Private route
const getSentMessages = asyncHandler(async (req, res) => {
	const search = req.query.search
	const page = +req.query.page
	const resultsPerPage = 12

	if (search) {
		const sentList = await Message.find({ sender: req.user._id, delSender: false })
			.populate('recipient', '_id username avatar')
			.sort({ createdAt: -1 })
			.lean()

		const fuse = new Fuse(sentList, {
			keys      : [ 'recipient.username', 'subject' ],
			threshold : 0.3,
			distance  : 200
		})

		const results = fuse.search(search).map((msg) => msg.item)

		if (results.length === 0) {
			return res.status(200).json({ messages: [] })
		}

		const pagination = {
			page       : page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		return res
			.status(200)
			.json({ messages: results.slice((page - 1) * resultsPerPage, page * resultsPerPage), pagination })
	} else {
		const count = await Message.countDocuments({ sender: req.user._id, delSender: false })

		if (count === 0) {
			return res.status(200).json({ messages: [] })
		}

		const sentMessages = await Message.find({ sender: req.user._id, delSender: false })
			.populate('recipient', '_id username avatar')
			.skip(resultsPerPage * (page - 1))
			.limit(resultsPerPage)
			.sort({ createdAt: -1 })
			.lean()

		if (sentMessages.length === 0) {
			if (results.length === 0) {
				return res.status(200).json({ messages: [] })
			}
		}

		const pagination = {
			page         : page,
			totalPages   : Math.ceil(count / resultsPerPage),
			totalItems   : count,
			itemsPerPage : resultsPerPage
		}

		return res.status(200).json({ messages: sentMessages, pagination })
	}
})

// <> @desc    Update message status
// <> @route   PATCH /api/messages/update/:id
// <> @access  Private route
const updateMessageStatus = asyncHandler(async (req, res) => {
	const { id } = req.params

	const messageExists = await Message.findById(id).select('_id read')

	if (messageExists) {
		if (messageExists.read) {
			return res.status(204).end()
		} else {
			const updatedMsg = await Message.findOneAndUpdate(
				{ _id: id },
				{ read: true, readAt: Date.now() },
				{ new: true }
			)
				.populate('sender', '_id username avatar')
				.lean()

			return res.status(200).json(updatedMsg)
		}
	} else {
		res.status(404)
		throw {
			message : 'Message not found'
		}
	}
})

// ! @desc    Delete messages
// ! @route   DELETE  /api/messages/delete
// ! @access  Private route
const deleteMessages = asyncHandler(async (req, res) => {
	const { ids, type } = req.body

	if (type === 'received') {
		await Message.updateMany({ _id: { $in: ids } }, { delRecipient: true })
	}
	if (type === 'sent') {
		await Message.updateMany({ _id: { $in: ids } }, { delSender: true })
		await Message.deleteMany({ _id: { $in: ids }, delSender: true, read: false })
	}

	return res.status(204).end()
})

// ~ @desc    Get new messages count
// ~ @route   GET  /api/messages/new/count
// ~ @access  Private route
const getNewMessagesCount = asyncHandler(async (req, res) => {
	const count = await Message.countDocuments({ read: false, recipient: req.user._id, delRecipient: false })

	return res.status(200).json(count)
})

export { sendMessage, getReceivedMessages, getSentMessages, getNewMessagesCount, deleteMessages, updateMessageStatus }
