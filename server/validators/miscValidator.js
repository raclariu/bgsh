import { check } from 'express-validator'
import User from '../models/userModel.js'
import Game from '../models/gameModel.js'

const validateReportType = check('type')
	.isIn([ 'user', 'game', 'other', 'bug', 'suggestion' ])
	.withMessage('Report type invalid')

const validateReportText = check('reportText')
	.trim()
	.isLength({ min: 1, max: 1000 })
	.withMessage('Report text must have between 1 and 1000 characters')
	.bail()
	.isString()
	.withMessage('Can only contain letters and numbers')

const validateReportUsername = check('username')
	.optional({ nullable: true })
	.if((value, { req }) => req.body.type === 'user')
	.trim()
	.isString()
	.withMessage('Invalid username')
	.bail()
	.isLength({ max: 20 })
	.withMessage('Username must have between 4 and 20 characters')
	.bail()
	.custom(async (username, { req }) => {
		if (username.toLowerCase() === req.user.username.toLowerCase()) {
			throw new Error('You cannot use your own username')
		}

		const usernameExists = await User.findOne({ username }).select('_id username status').lean()

		if (!usernameExists) {
			throw new Error('User not found')
		} else {
			if (usernameExists.status === 'banned') {
				throw new Error('User is banned')
			}

			return true
		}
	})

const validateReportGameAltId = check('altId')
	.optional({ nullable: true })
	.if((value, { req }) => req.body.type === 'game')
	.trim()
	.isString()
	.withMessage('Invalid username')
	.bail()
	.isLength({ min: 8, max: 8 })
	.withMessage('Game ID must have 8 characters')
	.bail()
	.custom(async (altId, { req }) => {
		const gameExists = await Game.findOne({ altId }).select('_id addedBy').lean()

		if (!gameExists) {
			throw new Error('Game not found')
		}

		if (gameExists.addedBy.toString() === req.user._id.toString()) {
			throw new Error('You cannot report your own game listing')
		}

		return true
	})

export { validateReportType, validateReportUsername, validateReportGameAltId, validateReportText }
