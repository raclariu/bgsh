import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'

import {
	sendMessage,
	getReceivedMessages,
	getSentMessages,
	getNewMessagesCount
} from '../controllers/messageController.js'
import {
	validateMessageRecipient,
	validateMessageSubject,
	validateMessageBody
} from '../validators/messageValidator.js'

// @ api/messages
router.route('/').post([ protect, validateMessageRecipient, validateMessageSubject, validateMessageBody ], sendMessage)
router.route('/received').get(protect, getReceivedMessages)
router.route('/sent').get(protect, getSentMessages)
router.route('/new').get(protect, getNewMessagesCount)

export default router
