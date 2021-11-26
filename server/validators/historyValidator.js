import { check } from 'express-validator'
import User from '../models/userModel.js'

const validateUsername = check('username').trim().custom(async (username, { req }) => {
	console.log('asdadasdasdasdasd')
	if (!username) {
		return true
	}

	if (username === req.user.username) {
		throw new Error('You cannot buy your own games')
	}

	if (username) {
		const usernameExists = await User.findOne({ username }).select('_id').lean()

		if (!usernameExists) {
			throw new Error('User not found')
		} else {
			return true
		}
	}
})

export { validateUsername }
