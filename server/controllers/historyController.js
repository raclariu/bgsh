import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Fuse from 'fuse.js'
import User from '../models/userModel.js'
import Game from '../models/gameModel.js'
import History from '../models/historyModel.js'

// * @desc    Add game(s) to history as a result of user selling or trading
// * @route   POST  /api/history
// * @access  Private route
const addGamesToHistory = asyncHandler(async (req, res) => {
	const { games, username, price, gameId } = req.body

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

	const simplifyGames = games.map((game) => {
		return { title: game.title, thumbnail: game.thumbnail, image: game.image, year: game.year }
	})

	const gameExists = await Game.findOne({ _id: gameId }).select('isActive isPack mode').lean()

	if (gameExists) {
		if (gameExists.isActive === false) {
			res.status(404)
			throw {
				message : 'Game is no longer available'
			}
		}

		const history = await History.create({
			mode       : gameExists.mode,
			isPack     : gameExists.isPack,
			addedBy    : req.user._id,
			buyer      : username ? username : null,
			games      : simplifyGames,
			finalPrice : price ? price : null
		})

		if (history) {
			await Game.findOneAndDelete({ _id: gameId })
			return res.status(204).end()
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

// ~ @desc    Get user games history
// ~ @route   GET  /api/history
// ~ @access  Private route
const getGamesHistory = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const search = req.query.search
	const resultsPerPage = 24
	const mode = req.query.mode

	const completeList = await History.find({ addedBy: req.user._id, mode }).sort({ createdAt: -1 }).lean()

	if (completeList.length === 0) {
		return res.status(200).json({ historyList: [] })
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

		return res.status(200).json({
			historyList : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const historyList = await History.find({ addedBy: req.user._id, mode })
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

		return res.status(200).json({
			historyList,
			pagination
		})
	}
})

export { addGamesToHistory, getGamesHistory }
