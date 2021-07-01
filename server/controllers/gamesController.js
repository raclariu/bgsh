import axios from 'axios'
import { validationResult } from 'express-validator'
import Fuse from 'fuse.js'
import asyncHandler from 'express-async-handler'
import Game from '../models/gameModel.js'
import { parseXML } from '../helpers/helpers.js'

// * @desc    Get games from BGG by ID
// * @route   POST  /api/games/bgg
// * @access  Private route
const getGamesFromBGG = asyncHandler(async (req, res) => {
	try {
		const { bggIds } = req.body

		let gamesArr = []

		const { data } = await axios.get('https://www.boardgamegeek.com/xmlapi2/thing', {
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
					rank      : Array.isArray(game.statistics.ratings.ranks.rank)
						? +game.statistics.ratings.ranks.rank.find((obj) => +obj.id === 1).value
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
		sellType,
		shipPost,
		shipPostPayer,
		shipCourier,
		shipCourierPayer,
		shipPersonal,
		shipCities,
		extraInfoTxt,
		totalPrice
	} = req.body

	if (sellType === 'pack') {
		await Game.create({
			seller           : req.user._id,
			games,
			sellType,
			shipPost,
			shipPostPayer,
			shipCourier,
			shipCourierPayer,
			shipPersonal,
			shipCities,
			extraInfoTxt,
			totalPrice
		})
	} else {
		let sellList = []
		for (let game of games) {
			let data = {
				seller           : req.user._id,
				games            : [ game ],
				sellType,
				shipPost,
				shipPostPayer,
				shipCourier,
				shipCourierPayer,
				shipPersonal,
				shipCities,
				extraInfoTxt,
				totalPrice       : game.price
			}
			sellList.push(data)
		}

		await Game.insertMany(sellList)
	}

	res.status(200).json('ok')
})

// ~ @desc    Get games that are up for sale
// ~ @route   GET /api/games/
// ~ @access  Private route
const getGames = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const search = req.query.search
	const sort = req.query.sort
	const resultsPerPage = 24

	if (search) {
		const saleData = await Game.find({}).populate('seller', 'username _id').lean()

		const fuse = new Fuse(saleData, { keys: [ 'games.title', 'games.designers' ], threshold: 0.3 })
		const results = fuse.search(search).map((game) => game.item).sort((a, b) => {
			if (sort === 'new') {
				return b.createdAt - a.createdAt
			} else if (sort === 'old') {
				return a.createdAt - b.createdAt
			} else if (sort === 'price-low') {
				return a.totalPrice - b.totalPrice
			} else if (sort === 'price-high') {
				return b.totalPrice - a.totalPrice
			} else if (sort === 'rank') {
				return a.games[0].stats.rank - b.games[0].stats.rank
			} else if (sort === 'year') {
				return a.games[0].year - b.games[0].year
			}
		})

		const pagination = {
			page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		res.status(200).json({
			saleData   : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const checkSort = () => {
			if (sort === 'new') {
				return { createdAt: 'desc' }
			} else if (sort === 'old') {
				return { createdAt: 'asc' }
			} else if (sort === 'price-low') {
				return { totalPrice: 'asc' }
			} else if (sort === 'price-high') {
				return { totalPrice: 'desc' }
			} else if (sort === 'rank') {
				return { 'games.stats.rank': 'asc' }
			} else if (sort === 'year') {
				return { 'games.year': 'asc' }
			}
		}

		const count = await Game.countDocuments({})

		const saleData = await Game.find({})
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

		res.status(200).json({ saleData, pagination })
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

	res.status(200).json(saleData)
})

export { getGamesFromBGG, sellGames, bggSearchGame, getGames, getSingleGame }
