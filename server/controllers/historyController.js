import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Fuse from 'fuse.js'
import User from '../models/userModel.js'
import Game from '../models/gameModel.js'
import History from '../models/historyModel.js'

// * @desc    Add game(s) to history as a result of user selling or trading
// * @route   POST  /api/history/add
// * @access  Private route
const addGamesToHistory = asyncHandler(async (req, res) => {
	const { games, username, price, gameId } = req.body

	console.log(games, username, price, gameId)

	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()

		res.status(400)
		throw {
			message : {
				usernameError : err.username ? err.username.msg : null
			}
		}
	}

	const gameExists = await Game.findOne({ _id: gameId }).select('type mode').lean()

	if (gameExists) {
		const history = await History.create({
			mode       : gameExists.mode,
			type       : gameExists.type,
			seller     : req.user._id,
			buyer      : username ? username : null,
			games,
			finalPrice : price ? price : null
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
	} else {
		res.status(404)
		throw {
			message : 'Game not found'
		}
	}
})

// ~ @desc    Get all user sold games history
// ~ @route   GET  /api/history/sold
// ~ @access  Private route
const getSoldGamesHistory = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const search = req.query.search
	const resultsPerPage = 24

	const completeList = await History.find({ seller: req.user._id, mode: 'sell' }).sort({ createdAt: -1 }).lean()

	if (completeList.length === 0) {
		res.status(404)
		throw {
			message : 'No games found'
		}
	}

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
		const soldList = await History.find({ seller: req.user._id, mode: 'sell' })
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

// ~ @desc    Get all user traded games history
// ~ @route   GET  /api/history/traded
// ~ @access  Private route
const getTradedGamesHistory = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const search = req.query.search
	const resultsPerPage = 24

	const completeList = await History.find({ seller: req.user._id, mode: 'trade' }).sort({ createdAt: -1 }).lean()

	if (completeList.length === 0) {
		res.status(404)
		throw {
			message : 'No games found'
		}
	}

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
			tradedList : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const tradedList = await History.find({ seller: req.user._id, mode: 'trade' })
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
			tradedList,
			pagination
		})
	}
})

export { addGamesToHistory, getSoldGamesHistory, getTradedGamesHistory }
