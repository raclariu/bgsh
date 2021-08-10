import axios from 'axios'
import { validationResult } from 'express-validator'
import Fuse from 'fuse.js'
import asyncHandler from 'express-async-handler'
import Game from '../models/gameModel.js'
import User from '../models/userModel.js'
import { parseXML } from '../helpers/helpers.js'

// * @desc    Get games from BGG by ID
// * @route   POST  /api/games/bgg
// * @access  Private route
const getGamesFromBGG = asyncHandler(async (req, res) => {
	try {
		const { bggIds } = req.body

		let gamesArr = []

		const { data } = await axios.get('https://api.geekdo.com/xmlapi2/thing', {
			params : {
				id       : bggIds.join(','),
				versions : 1,
				stats    : 1
			}
		})

		let { item } = await parseXML(data)
		const ensureArray = Array.isArray(item) ? item : [ item ]

		for (let game of ensureArray) {
			const item = {
				type               : game.type === 'boardgame' ? 'boardgame' : 'expansion',
				bggId              : game.id,
				thumbnail          : game.thumbnail || null,
				image              : game.image || null,
				title              : Array.isArray(game.name)
					? game.name.find((obj) => obj.type === 'primary').value
					: game.name.value,
				year               : +game.yearpublished.value,
				designers          : game.link
					.filter((link) => link.type === 'boardgamedesigner')
					.map((designer) => designer.value),
				minPlayers         : +game.minplayers.value,
				maxPlayers         : +game.maxplayers.value,
				suggestedPlayers   :
					+game.poll.find((obj) => obj.name === 'suggested_numplayers').totalvotes > 15
						? Array.isArray(game.poll.find((obj) => obj.name === 'suggested_numplayers').results)
							? +game.poll
									.find((obj) => obj.name === 'suggested_numplayers')
									.results.sort(
										(a, b) =>
											+b.result.find((obj) => obj.value === 'Best').numvotes -
											+a.result.find((obj) => obj.value === 'Best').numvotes
									)[0].numplayers
							: null
						: null,
				languageDependence : game.poll
					? +game.poll.find((obj) => obj.name === 'language_dependence').totalvotes > 10
						? game.poll
								.find((obj) => obj.name === 'language_dependence')
								.results.result.sort((a, b) => +b.numvotes - +a.numvotes)[0].value
						: 'Not enough votes'
					: null,
				playTime           :
					+game.playingtime.value === 0
						? null
						: game.minplaytime.value === game.maxplaytime.value
							? game.maxplaytime.value
							: `${game.minplaytime.value} - ${game.maxplaytime.value}`,
				minAge             : +game.minage.value === 0 ? null : +game.minage.value,
				categories         : game.link.filter((link) => link.type === 'boardgamecategory').map((ctg) => {
					return { id: +ctg.id, name: ctg.value }
				}),
				mechanics          : game.link.filter((link) => link.type === 'boardgamemechanic').map((mec) => {
					return { id: +mec.id, name: mec.value }
				}),
				versions           : Array.isArray(game.versions.item)
					? game.versions.item.map((v) => {
							return {
								title : v.name.value,
								year  : +v.yearpublished.value
							}
						})
					: [ { title: game.versions.item.name.value, year: +game.versions.item.yearpublished.value } ],
				stats              : {
					ratings   : +game.statistics.ratings.usersrated.value,
					avgRating : +parseFloat(game.statistics.ratings.average.value).toFixed(2),
					rank      :
						game.type === 'boardgame'
							? Array.isArray(game.statistics.ratings.ranks.rank)
								? +game.statistics.ratings.ranks.rank.find((obj) => +obj.id === 1).value
								: 'N/A'
							: 'N/A'
				},
				complexity         : {
					weight :
						+game.statistics.ratings.numweights.value > 0
							? +parseFloat(game.statistics.ratings.averageweight.value).toFixed(2)
							: 'N/A',
					votes  : +game.statistics.ratings.numweights.value
				}
			}

			gamesArr.push(item)
		}

		res.status(200).json(gamesArr)
	} catch (error) {
		res.status(503)
		throw {
			message : 'Failed to retrieve data from BGG',
			devErr  : error.stack
		}
	}
})

// * @desc    Search BGG for games
// * @route   POST  /api/games/bgg/search
// * @access  Private route
const bggSearchGame = asyncHandler(async (req, res) => {
	try {
		const { keyword } = req.body

		const { data } = await axios.get('https://api.geekdo.com/xmlapi2/search', {
			params : {
				query : keyword.split(' ').join('+'),
				type  : 'boardgame,boardgameexpansion'
			}
		})

		let parsedSearch = await parseXML(data)

		if (parsedSearch.total === '0') {
			res.status(404)
			throw {
				message : 'No games found'
			}
		}

		const ensureArray = Array.isArray(parsedSearch.item) ? parsedSearch.item : [ parsedSearch.item ]

		const gamesArr = []
		for (let game of ensureArray) {
			const item = {
				bggId     : game.id,
				title     : game.name.value,
				year      : game.yearpublished ? +game.yearpublished.value : '-',
				thumbnail : null
			}
			gamesArr.push(item)
		}

		res.status(200).json(gamesArr)
	} catch (error) {
		res.status(503)
		throw {
			message : 'Failed to retrieve data from BGG',
			devErr  : error.stack
		}
	}
})

// * @desc    Put up games for sale
// * @route   POST  /api/games/sell
// * @access  Private route
const sellGames = asyncHandler(async (req, res) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		res.status(400)
		throw {
			message : validationErrors.errors.map((err) => err.msg)
		}
	}

	const {
		games,
		type,
		shipPost,
		shipPostPayer,
		shipCourier,
		shipCourierPayer,
		shipPersonal,
		shipCities,
		extraInfoPack,
		totalPrice
	} = req.body

	console.log(req.body)

	if (type === 'pack') {
		await Game.create({
			mode             : 'sell',
			seller           : req.user._id,
			games,
			type,
			shipPost,
			shipPostPayer,
			shipCourier,
			shipCourierPayer,
			shipPersonal,
			shipCities,
			extraInfoPack,
			totalPrice
		})
	} else {
		let sellList = []
		games.forEach((game, index) => {
			let data = {
				mode             : 'sell',
				seller           : req.user._id,
				games            : [ game ],
				type,
				shipPost,
				shipPostPayer,
				shipCourier,
				shipCourierPayer,
				shipPersonal,
				shipCities,
				extraInfoPack,
				totalPrice       : games[index].price
			}
			sellList.push(data)
		})

		await Game.insertMany(sellList)
	}

	res.status(204).end()
})

// * @desc    Put up games for trade
// * @route   POST  /api/games/trade
// * @access  Private route
const tradeGames = asyncHandler(async (req, res) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		res.status(400)
		throw {
			message : validationErrors.errors.map((err) => err.msg)
		}
	}

	const { games, type, shipPost, shipCourier, shipPersonal, shipCities, extraInfoPack } = req.body

	if (type === 'pack') {
		await Game.create({
			mode          : 'trade',
			seller        : req.user._id,
			games,
			type,
			shipPost,
			shipCourier,
			shipPersonal,
			shipCities,
			extraInfoPack
		})
	} else {
		let tradeList = []
		for (let game of games) {
			let data = {
				mode          : 'trade',
				seller        : req.user._id,
				games         : [ game ],
				type,
				shipPost,
				shipCourier,
				shipPersonal,
				shipCities,
				extraInfoPack
			}
			tradeList.push(data)
		}

		await Game.insertMany(tradeList)
	}

	res.status(204).end()
})

// ~ @desc    Get games that are up for sale or trade
// ~ @route   GET /api/games
// ~ @access  Private route
const getGames = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const search = req.query.search
	const sortBy = req.query.sort
	const mode = req.query.mode
	const resultsPerPage = 24

	if (search) {
		const gamesData = await Game.find({ isActive: true, mode: mode }).populate('seller', 'username _id').lean()

		const fuse = new Fuse(gamesData, { keys: [ 'games.title', 'games.designers' ], threshold: 0.3, distance: 200 })
		const results = fuse.search(search).map((game) => game.item).sort((a, b) => {
			if (sortBy === 'new') {
				return b.createdAt - a.createdAt
			} else if (sortBy === 'old') {
				return a.createdAt - b.createdAt
			} else if (sortBy === 'price-low') {
				return a.totalPrice - b.totalPrice
			} else if (sortBy === 'price-high') {
				return b.totalPrice - a.totalPrice
			} else if (sortBy === 'rank') {
				return a.games[0].stats.rank - b.games[0].stats.rank
			} else if (sortBy === 'year') {
				return b.games[0].year - a.games[0].year
			}
		})

		if (results.length === 0) {
			res.status(404)
			throw {
				message : 'No games found'
			}
		}

		const pagination = {
			page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		res.status(200).json({
			gamesData  : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const checkSort = () => {
			if (sortBy === 'new') {
				return { createdAt: 'desc' }
			} else if (sortBy === 'old') {
				return { createdAt: 'asc' }
			} else if (sortBy === 'price-low') {
				return { totalPrice: 'asc' }
			} else if (sortBy === 'price-high') {
				return { totalPrice: 'desc' }
			} else if (sortBy === 'rank') {
				return { 'games.stats.rank': 'asc' }
			} else if (sortBy === 'year') {
				return { 'games.year': 'desc' }
			}
		}

		const count = await Game.countDocuments({ isActive: true, mode: mode })

		const gamesData = await Game.find({ isActive: true, mode: mode })
			.skip(resultsPerPage * (page - 1))
			.limit(resultsPerPage)
			.populate('seller', 'username _id')
			.sort(checkSort())
			.lean()

		const pagination = {
			page,
			totalPages   : Math.ceil(count / resultsPerPage),
			totalItems   : count,
			itemsPerPage : resultsPerPage
		}

		res.status(200).json({ gamesData, pagination })
	}
})

// ~ @desc    Get all games up for sale for one single user
// ~ @route   GET /api/games/user/:id
// ~ @access  Private route
const getUserActiveGames = asyncHandler(async (req, res) => {
	const { id } = req.params
	const page = +req.query.page
	const search = req.query.search
	const resultsPerPage = 24

	const allUserGames = await Game.find({ seller: id }).lean()

	if (allUserGames.length === 0) {
		res.status(404)
		throw {
			message : 'No games found'
		}
	}

	if (search) {
		const fuse = new Fuse(allUserGames, {
			keys      : [ 'games.title', 'games.designers' ],
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
			activeGames : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const games = await Game.find({ seller: id })
			.skip(resultsPerPage * (page - 1))
			.limit(resultsPerPage)
			.sort({ createdAt: -1 })
			.lean()

		const pagination = {
			page         : page,
			totalPages   : Math.ceil(allUserGames.length / resultsPerPage),
			totalItems   : allUserGames.length,
			itemsPerPage : resultsPerPage
		}

		res.status(200).json({
			activeGames : games,
			pagination
		})
	}
})

// <> @desc    Reactivate one game
// <> @route   PATCH /api/games/reactivate/:id
// <> @access  Private route
const reactivateGame = asyncHandler(async (req, res) => {
	const { id } = req.params

	const gameExists = await Game.findOne({ _id: id }).select('_id')

	if (gameExists) {
		await Game.updateOne({ _id: id }, { isActive: true })

		res.status(204).end()
	} else {
		res.status(404)
		throw {
			message : 'Game not found'
		}
	}
})

// ~ @desc    Get single up for sale game
// ~ @route   GET /api/games/:altId
// ~ @access  Private route
const getSingleGame = asyncHandler(async (req, res) => {
	const { altId } = req.params
	const saleData = await Game.findOne({ altId }).populate('seller', 'username _id').lean()

	if (!saleData) {
		res.status(404)
		throw {
			message : 'Game not found'
		}
	}

	if (saleData.isActive === false) {
		res.status(404)
		throw {
			message : 'Game is inactive'
		}
	}

	res.status(200).json(saleData)
})

// * @desc    Save game
// * @route   POST  /api/games/saved
// * @access  Private route
const switchSaveGame = asyncHandler(async (req, res) => {
	const { altId } = req.body
	const saleData = await Game.findOne({ altId }).select('_id').lean()

	if (!saleData) {
		res.status(404)
		throw {
			message : 'Game not found'
		}
	}

	const user = await User.findOne({ _id: req.user._id }).select('savedGames').lean()

	if (!user) {
		res.status(404)
		throw {
			message : 'User not found'
		}
	}

	if (user.savedGames.map((id) => id.toString()).indexOf(saleData._id.toString()) === -1) {
		user.savedGames.unshift(saleData._id)
		await User.updateOne({ _id: req.user._id }, { savedGames: user.savedGames })
		res.status(200).send(true)
	} else {
		const filtered = user.savedGames.filter((id) => id.toString() !== saleData._id.toString())
		await User.updateOne({ _id: req.user._id }, { savedGames: filtered })
		res.status(200).send(false)
	}
})

// ~ @desc    Get one saved games
// ~ @route   GET /api/games/saved/:altId
// ~ @access  Private route
const getSingleSavedGame = asyncHandler(async (req, res) => {
	const altId = req.params.altId

	const user = await User.findOne({ _id: req.user._id })
		.select('savedGames -_id')
		.populate({ path: 'savedGames', match: { altId: altId }, select: 'altId -_id' })
		.lean()

	if (!user) {
		res.status(404)
		throw {
			message : 'User not found'
		}
	}

	if (user.savedGames.length > 0) {
		res.status(200).send(true)
	} else {
		res.status(200).send(false)
	}
})

// ~ @desc    Get saved games
// ~ @route   GET /api/games/saved
// ~ @access  Private route
const getSavedGames = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const search = req.query.search
	const resultsPerPage = 24

	const user = await User.findOne({ _id: req.user._id }).select('savedGames').populate('savedGames').lean()

	if (!user) {
		res.status(404)
		throw {
			message : 'User not found'
		}
	}

	if (user.savedGames.length === 0) {
		res.status(404)
		throw {
			message : 'Your saved games list is empty'
		}
	}

	if (search) {
		const fuse = new Fuse(user.savedGames, {
			keys      : [ 'games.title', 'games.designers' ],
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
			list       : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const { savedGames } = await User.findOne({ _id: req.user._id }).select('savedGames').populate({
			path    : 'savedGames',
			options : {
				limit : resultsPerPage,
				sort  : { createdAt: -1 },
				skip  : resultsPerPage * (page - 1)
			}
		})

		const pagination = {
			page         : page,
			totalPages   : Math.ceil(user.savedGames.length / resultsPerPage),
			totalItems   : user.savedGames.length,
			itemsPerPage : resultsPerPage
		}

		res.status(200).json({
			list       : savedGames,
			pagination
		})
	}
})

// ! @desc    Delete one game
// ! @route   DELETE /api/games/delete/:id
// ! @access  Private route
const deleteGame = asyncHandler(async (req, res) => {
	const { id } = req.params
	const game = await Game.findOneAndDelete({ _id: id })

	if (!game) {
		res.status(404)
		throw {
			message : 'Game not found'
		}
	}

	res.status(204).end()
})

export {
	getGamesFromBGG,
	sellGames,
	tradeGames,
	bggSearchGame,
	getGames,
	getSingleGame,
	switchSaveGame,
	getSavedGames,
	getSingleSavedGame,
	getUserActiveGames,
	deleteGame,
	reactivateGame
}
