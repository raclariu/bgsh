import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Fuse from 'fuse.js'
import User from '../models/userModel.js'
import Game from '../models/gameModel.js'
import History from '../models/historyModel.js'

// * @desc    Add sold games to history
// * @route   POST  /api/history/sell
// * @access  Private route
const addSoldGamesToHistory = asyncHandler(async (req, res) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()

		res.status(400)
		throw {
			message : {
				otherUsername : err.otherUsername ? err.otherUsername.msg : null,
				finalPrice    : err.finalPrice ? err.finalPrice.msg : null,
				extraInfo     : err.extraInfo ? err.extraInfo.msg : null
			}
		}
	}

	const { games, gameId, finalPrice, extraInfo } = req.body

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

		// const otherUserId = otherUsername ? await User.findOne({ username: otherUsername }).select('_id').lean() : null

		const history = await History.create({
			mode       : 'sell',
			isPack     : gameExists.isPack,
			addedBy    : req.user._id,
			otherUser  : req.otherUsernameId ? req.otherUsernameId : null,
			games      : simplifyGames,
			finalPrice : finalPrice,
			extraInfo  : extraInfo || null
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

// * @desc    Add traded games to history
// * @route   POST  /api/history/trade
// * @access  Private route
const addTradedGamesToHistory = asyncHandler(async (req, res) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()

		res.status(400)
		throw {
			message : {
				otherUsername : err.otherUsername ? err.otherUsername.msg : null,
				extraInfo     : err.extraInfo ? err.extraInfo.msg : null
			}
		}
	}

	const { games, extraInfo, gameId } = req.body

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

		// const otherUserId = otherUsername ? await User.findOne({ username: otherUsername }).select('_id').lean() : null

		const history = await History.create({
			mode      : 'trade',
			isPack    : gameExists.isPack,
			addedBy   : req.user._id,
			otherUser : req.otherUsernameId ? req.otherUsernameId : null,
			games     : simplifyGames,
			extraInfo : extraInfo || null
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

// * @desc    Add bought games to history
// * @route   POST  /api/history/buy
// * @access  Private route
const addBoughtGamesToHistory = asyncHandler(async (req, res) => {
	let message = {}
	const validationErrors = validationResult(req).formatWith(({ msg, param }) => {
		message[param] = msg
	})
	if (!validationErrors.isEmpty()) {
		validationErrors.mapped()

		res.status(400)
		throw {
			message
		}
	}

	const { games, extraInfoPack, finalPrice, isPack, otherUsername } = req.body

	if (isPack) {
		// const otherUserId = otherUsername ? await User.findOne({ username: otherUsername }).select('_id').lean() : null
		await History.create({
			mode          : 'buy',
			isPack        : true,
			games         : games.map((game) => {
				return {
					title     : game.title,
					thumbnail : game.thumbnail,
					image     : game.image,
					year      : game.year,
					version   : game.version,
					extraInfo : game.extraInfo || null,
					isSleeved : game.isSleeved
				}
			}),
			addedBy       : req.user._id,
			otherUser     : req.otherUsernameId ? req.otherUsernameId : null,
			extraInfoPack : extraInfoPack ? extraInfoPack.trim() : null,
			finalPrice    : finalPrice ? finalPrice : null
		})
	} else {
		const buyList = []
		for (let game of games) {
			const otherUserId = game.otherUsername
				? await User.findOne({ username: game.otherUsername }).select('_id').lean()
				: null
			const data = {
				mode       : 'buy',
				isPack     : false,
				games      : [
					{
						title     : game.title,
						thumbnail : game.thumbnail,
						image     : game.image,
						year      : game.year,
						version   : game.version,
						extraInfo : game.extraInfo || null,
						isSleeved : game.isSleeved
					}
				],
				addedBy    : req.user._id,
				otherUser  : otherUserId ? otherUserId._id : null,
				finalPrice : game.price
			}
			buyList.push(data)
		}
		await History.insertMany(buyList)
	}
	res.status(204).end()
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

export { addSoldGamesToHistory, addTradedGamesToHistory, addBoughtGamesToHistory, getGamesHistory }
