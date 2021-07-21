import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Fuse from 'fuse.js'
import User from '../models/userModel.js'
import Game from '../models/gameModel.js'
import History from '../models/historyModel.js'

// * @desc    Add game(s) to history as a result of user selling
// * @route   POST  /api/history/add
// * @access  Private route
const addGamesToHistory = asyncHandler(async (req, res) => {
	const { games, username, price, gameId } = req.body

	console.log(games, username, price, gameId)

	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()

		res.status(401)
		throw {
			message : {
				usernameError : err.username ? err.username.msg : null
			}
		}
	}

	const history = await History.create({
		seller     : req.user._id,
		buyer      : username ? username : null,
		games,
		finalPrice : price
	})

	if (history) {
		await Game.findOneAndDelete({ _id: gameId })
		res.status(200).json('success')
	} else {
		res.status(500)
		throw {
			message : 'Error. Please try again'
		}
	}
})

// ~ @desc    Get all games sold by the user
// ~ @route   GET  /api/history/sold
// ~ @access  Private route
const getSoldGamesHistory = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const search = req.query.search
	const resultsPerPage = 24

	const completeList = await History.find({ seller: req.user._id }).sort({ createdAt: -1 }).lean()

	if (search) {
		const fuse = new Fuse(completeList, {
			keys      : [ 'games.title' ],
			threshold : 0.3,
			distance  : 200
		})

		const results = fuse.search(search).map((game) => game.item)

		const pagination = {
			page       : page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		res.status(200).json({
			soldList   : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const soldList = await History.find({ seller: req.user._id })
			.sort({ createdAt: -1 })
			.skip(resultsPerPage * (page - 1))
			.limit(resultsPerPage)
			.lean()

		const pagination = {
			page         : page,
			totalPages   : Math.ceil(completeList.length / resultsPerPage),
			totalItems   : completeList.length,
			itemsPerPage : resultsPerPage
		}

		res.status(200).json({
			soldList,
			pagination
		})
	}
})

export { addGamesToHistory, getSoldGamesHistory }
