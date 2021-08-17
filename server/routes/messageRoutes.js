import express from 'express'
const router = express.Router()
import { protect } from '../middlewares/authMiddleware.js'

import { sendMessage, getAllMessages } from '../controllers/messageController.js'
import {
	validateMessageRecipient,
	validateMessageSubject,
	validateMessageBody
} from '../validators/messageValidator.js'

// @ api/messages
router
	.route('/')
	.get(protect, getAllMessages)
	.post([ protect, validateMessageRecipient, validateMessageSubject, validateMessageBody ], sendMessage)

export default router
