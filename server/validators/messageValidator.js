import { check } from 'express-validator'
import User from '../models/userModel.js'

const validateMessageRecipient = check('recipient')
	.trim()
	.notEmpty()
	.withMessage('Username is required')
	.bail()
	.isLength({ min: 4, max: 20 })
	.withMessage('Username must have between 4 and 20 characters')
	.bail()
	.isAlphanumeric()
	.withMessage('Username can only contain letters and numbers')
	.bail()
	.custom(async (username, { req }) => {
		if (username) {
			const usernameExists = await User.findOne({ username }).select('_id').lean()

			if (!usernameExists) {
				throw new Error('User not found')
			} else {
				if (req.user._id.toString() === usernameExists._id.toString()) {
					throw new Error('You cannot send a message to yourself')
				}
				req.recipientId = usernameExists._id
				return true
			}
		}
	})

const validateMessageSubject = check('subject')
	.trim()
	.notEmpty()
	.withMessage('Subject is required')
	.bail()
	.isLength({ min: 1, max: 60 })
	.withMessage('Subject must have between 1 and 60 characters')

const validateMessageBody = check('message')
	.trim()
	.isLength({ min: 1, max: 500 })
	.withMessage('Message must have between 1 and 500 characters')
	.bail()
	.isString()
	.withMessage('Can only contain letters and numbers')

export { validateMessageRecipient, validateMessageSubject, validateMessageBody }
