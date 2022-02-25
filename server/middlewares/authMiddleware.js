import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import { differenceInMinutes } from 'date-fns'

const protect = asyncHandler(async (req, res, next) => {
	let token

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			token = req.headers.authorization.split(' ')[1]

			const decoded = jwt.verify(token, process.env.JWT_SECRET)

			req.user = await User.findById(decoded.id).select('_id isAdmin email username avatar lastSeen').lean()

			if (differenceInMinutes(new Date(), req.user.lastSeen) >= 30) {
				const updated = await User.findOneAndUpdate(
					{ _id: req.user._id },
					{ lastSeen: Date.now() },
					{ new: true }
				)
					.select('lastSeen -_id')
					.lean()
				req.user.lastSeen = updated.lastSeen
			}

			if (!req.user) {
				res.status(401)
				throw {
					message : 'Not authorized, token failed',
					devErr  : error.stack
				}
			}

			next()
		} catch (error) {
			res.status(401)
			throw {
				message : 'Not authorized, token failed',
				devErr  : error.stack
			}
		}
	}

	if (!token) {
		res.status(401)
		throw {
			message : 'Not authorized, token failed'
		}
	}
})

const admin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next()
	} else {
		res.status(401)
		throw new Error('Not authorized as an admin')
	}
}

export { protect, admin }
