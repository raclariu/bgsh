import asyncHandler from 'express-async-handler'
import Kickstarter from '../models/ksModel.js'

// ~ @desc    Get all kickstarters
// ~ @route   GET  /api/misc/kickstarters
// ~ @access  Public route
const getKickstarters = asyncHandler(async (req, res) => {
	const kickstarters = await Kickstarter.find({})

	if (kickstarters.length === 0) {
		res.status(404)
		throw {
			message : 'No kickstarters found'
		}
	}

	res.status(200).json(kickstarters)
})

export { getKickstarters }
