import { validationResult } from 'express-validator'
import axios from 'axios'
import Fuse from 'fuse.js'
import asyncHandler from 'express-async-handler'
import Game from '../models/gameModel.js'
import User from '../models/userModel.js'
import Notification from '../models/notificationModel.js'
import Wishlist from '../models/collectionModels/wishlistModel.js'
import WantInTrade from '../models/collectionModels/wantInTradeModel.js'
import WantToBuy from '../models/collectionModels/wantToBuyModel.js'
import List from '../models/listModel.js'
import storage from '../helpers/storage.js'
import { parseXML } from '../helpers/helpers.js'
import { genNanoId } from '../helpers/helpers.js'

// * @desc    Add games for sale
// * @route   POST  /api/games/sell
// * @access  Private route
const listSaleGames = asyncHandler(async (req, res) => {
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

	const {
		games,
		isPack,
		shipPost,
		shipPostPayer,
		shipCourier,
		shipCourierPayer,
		shipPersonal,
		shipCities,
		extraInfoPack,
		totalPrice
	} = req.body

	if (isPack) {
		const generatedAltId = genNanoId(8)
		const { slug, games: listedGames } = await Game.create({
			mode          : 'sell',
			addedBy       : req.user._id,
			games,
			shipping      : {
				shipPost,
				shipPostPayer,
				shipCourier,
				shipCourierPayer,
				shipPersonal,
				shipCities
			},
			altId         : generatedAltId,
			totalPrice,
			extraInfoPack,
			isPack,
			slug          : `/sales/${generatedAltId}`
		})

		res.status(204).end()

		let notifArr = []

		// for wishlist
		for (let game of listedGames) {
			const userWishlists = await Wishlist.find({ 'wishlist.bggId': game.bggId }).select('user').lean()

			if (userWishlists.length > 0) {
				const filteredUserWishlists = userWishlists.filter(
					(list) => list.user.toString() !== req.user._id.toString()
				)

				for (let obj of filteredUserWishlists) {
					notifArr.push({
						recipient : obj.user,
						type      : 'wishlist',
						text      : `A pack containing ${game.title} has been listed for sale`,
						meta      : {
							slug,
							thumbnail : game.thumbnail
						}
					})
				}
			}
		}

		// for want to buy
		for (let game of listedGames) {
			const userWantToBuyLists = await WantToBuy.find({ 'wantToBuy.bggId': game.bggId }).select('user').lean()

			if (userWantToBuyLists.length > 0) {
				const filteredUserWantToBuyLists = userWantToBuyLists.filter(
					(list) => list.user.toString() !== req.user._id.toString()
				)

				for (let obj of filteredUserWantToBuyLists) {
					notifArr.push({
						recipient : obj.user,
						type      : 'wantToBuy',
						text      : `A pack containing ${game.title} has been listed for sale`,
						meta      : {
							slug,
							thumbnail : game.thumbnail
						}
					})
				}
			}
		}

		if (notifArr.length > 0) {
			await Notification.insertMany(notifArr)
		}
	} else {
		let sellList = []
		games.forEach((game, index) => {
			const generatedAltId = genNanoId(8)
			let data = {
				mode          : 'sell',
				addedBy       : req.user._id,
				games         : [ game ],
				shipping      : {
					shipPost,
					shipPostPayer,
					shipCourier,
					shipCourierPayer,
					shipPersonal,
					shipCities
				},
				totalPrice    : games[index].price,
				extraInfoPack,
				altId         : generatedAltId,
				isPack,
				slug          : `/sales/${generatedAltId}`
			}
			sellList.push(data)
		})

		const insertedGames = await Game.insertMany(sellList)
		res.status(204).end()

		let notifArr = []

		// for wishlists
		for (let data of insertedGames) {
			const { bggId } = data.games[0]
			const userWishlists = await Wishlist.find({ 'wishlist.bggId': bggId }).select('user').lean()

			if (userWishlists.length > 0) {
				const filteredUserWishlists = userWishlists.filter(
					(list) => list.user.toString() !== req.user._id.toString()
				)

				for (let obj of filteredUserWishlists) {
					notifArr.push({
						recipient : obj.user,
						type      : 'wishlist',
						text      : `${data.games[0].title} has been listed for sale`,
						meta      : {
							slug      : data.slug,
							thumbnail : data.games[0].thumbnail
						}
					})
				}
			}
		}

		// for want to buy
		for (let data of insertedGames) {
			const { bggId } = data.games[0]
			const userWantToBuyLists = await WantToBuy.find({ 'wantToBuy.bggId': bggId }).select('user').lean()

			if (userWantToBuyLists.length > 0) {
				const filteredUserWantToBuyLists = userWantToBuyLists.filter(
					(list) => list.user.toString() !== req.user._id.toString()
				)

				for (let obj of filteredUserWantToBuyLists) {
					notifArr.push({
						recipient : obj.user,
						type      : 'wantToBuy',
						text      : `${data.games[0].title} has been listed for sale`,
						meta      : {
							slug      : data.slug,
							thumbnail : data.games[0].thumbnail
						}
					})
				}
			}
		}

		if (notifArr.length > 0) {
			await Notification.insertMany(notifArr)
		}
	}
})

// * @desc    Add games for trade
// * @route   POST  /api/games/trade
// * @access  Private route
const listTradeGames = asyncHandler(async (req, res) => {
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

	const { games, isPack, shipPost, shipCourier, shipPersonal, shipCities, extraInfoPack } = req.body

	if (isPack) {
		const generatedAltId = genNanoId(8)
		const { slug, games: listedGames } = await Game.create({
			mode          : 'trade',
			addedBy       : req.user._id,
			games,
			shipping      : {
				shipPost,
				shipCourier,
				shipPersonal,
				shipCities
			},
			extraInfoPack,
			isPack,
			altId         : generatedAltId,
			slug          : `/trades/${generatedAltId}`
		})

		res.status(204).end()

		let notifArr = []
		// for wishlists
		for (let game of listedGames) {
			const userWishlists = await Wishlist.find({ 'wishlist.bggId': game.bggId }).select('user').lean()

			if (userWishlists.length > 0) {
				const filteredUserWishlists = userWishlists.filter(
					(list) => list.user.toString() !== req.user._id.toString()
				)

				for (let obj of filteredUserWishlists) {
					notifArr.push({
						recipient : obj.user,
						type      : 'wishlist',
						text      : `A pack containing ${game.title} has been listed for trade`,
						meta      : {
							slug,
							thumbnail : game.thumbnail
						}
					})
				}
			}
		}

		// for want in trade
		for (let game of listedGames) {
			const userWantInTradeLists = await WantInTrade.find({ 'wantInTrade.bggId': game.bggId })
				.select('user')
				.lean()

			if (userWantInTradeLists.length > 0) {
				const filteredUserWantInTradeLists = userWantInTradeLists.filter(
					(list) => list.user.toString() !== req.user._id.toString()
				)

				for (let obj of filteredUserWantInTradeLists) {
					notifArr.push({
						recipient : obj.user,
						type      : 'wantInTrade',
						text      : `A pack containing ${game.title} has been listed for trade`,
						meta      : {
							slug,
							thumbnail : game.thumbnail
						}
					})
				}
			}
		}

		if (notifArr.length > 0) {
			await Notification.insertMany(notifArr)
		}
	} else {
		let tradeList = []
		for (let game of games) {
			const generatedAltId = genNanoId(8)
			let data = {
				mode          : 'trade',
				addedBy       : req.user._id,
				games         : [ game ],
				shipping      : {
					shipPost,
					shipCourier,
					shipPersonal,
					shipCities
				},
				extraInfoPack,
				isPack,
				altId         : generatedAltId,
				slug          : `/trades/${generatedAltId}`
			}
			tradeList.push(data)
		}

		const insertedGames = await Game.insertMany(tradeList)
		res.status(204).end()

		let notifArr = []
		// for wishlists
		for (let data of insertedGames) {
			const { bggId } = data.games[0]
			const userWishlists = await Wishlist.find({ 'wishlist.bggId': bggId }).select('user').lean()

			if (userWishlists.length > 0) {
				const filteredUserWishlists = userWishlists.filter(
					(list) => list.user.toString() !== req.user._id.toString()
				)

				for (let obj of filteredUserWishlists) {
					notifArr.push({
						recipient : obj.user,
						type      : 'wishlist',
						text      : `${data.games[0].title} has been listed for trade`,
						meta      : {
							slug      : data.slug,
							thumbnail : data.games[0].thumbnail
						}
					})
				}
			}
		}

		// for want in trade
		for (let data of insertedGames) {
			const { bggId } = data.games[0]
			const userWantInTradeLists = await WantInTrade.find({ 'wantInTrade.bggId': bggId }).select('user').lean()

			if (userWantInTradeLists.length > 0) {
				const filteredUserWantInTradeLists = userWantInTradeLists.filter(
					(list) => list.user.toString() !== req.user._id.toString()
				)

				for (let obj of filteredUserWantInTradeLists) {
					notifArr.push({
						recipient : obj.user,
						type      : 'wantInTrade',
						text      : `${data.games[0].title} has been listed for trade`,
						meta      : {
							slug      : data.slug,
							thumbnail : data.games[0].thumbnail
						}
					})
				}
			}
		}

		if (notifArr.length > 0) {
			await Notification.insertMany(notifArr)
		}
	}
})

// * @desc    Add wanted games
// * @route   POST  /api/games/wanted
// * @access  Private route
const listWantedGames = asyncHandler(async (req, res) => {
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

	const { games, shipPost, shipCourier, shipPersonal, shipCities } = req.body

	let wantedList = []
	for (let game of games) {
		const generatedAltId = genNanoId(8)
		let data = {
			mode     : 'want',
			addedBy  : req.user._id,
			games    : [ game ],
			shipping : {
				shipPost,
				shipCourier,
				shipPersonal,
				shipCities
			},
			isPack   : false,
			altId    : generatedAltId,
			slug     : `/wanted/${generatedAltId}`
		}
		wantedList.push(data)
	}
	await Game.insertMany(wantedList)

	return res.status(204).end()
})

// * @desc    Upload game image
// * @route   POST  /api/games/images
// * @access  Private route
const uploadImage = asyncHandler(async (req, res) => {
	try {
		const { bggId } = req.body

		const { full, thumbnail } = req.resizedFiles

		const fileName = genNanoId(15)
		const bucket = storage.bucket(process.env.IMG_BUCKET)
		const fullBucketFile = bucket.file(`f/${fileName}.webp`)
		const thumbnailBucketFile = bucket.file(`t/${fileName}.webp`)

		const options = {
			resumable : false,
			metadata  : {
				contentType  : 'image/webp',
				cacheControl : 'public, max-age=31536000'
			}
		}

		await fullBucketFile.save(full.buffer, options)
		await thumbnailBucketFile.save(thumbnail.buffer, options)

		await fullBucketFile.makePublic()
		await thumbnailBucketFile.makePublic()

		const userImage = {
			full      : fullBucketFile.publicUrl(),
			thumbnail : thumbnailBucketFile.publicUrl(),
			name      : `${fileName}.webp`
		}

		const userList = await List.findOne({ addedBy: req.user._id }).select('list').lean()
		const idx = userList.list.findIndex((obj) => obj.bggId === bggId)
		userList.list[idx].userImage = userImage
		await List.updateOne({ _id: userList._id }, { list: userList.list })

		return res.status(200).json(userImage)
	} catch (error) {
		res.status(503)
		throw { message: 'Error while uploading image. Try again' }
	}
})

// ! @desc    Delete game image
// ! @route   Delete  /api/games/images
// ! @access  Private route
const deleteImage = asyncHandler(async (req, res) => {
	try {
		const { fileName, bggId } = req.body

		await storage.bucket(process.env.IMG_BUCKET).file(`f/${fileName}`).delete({ ignoreNotFound: true })
		await storage.bucket(process.env.IMG_BUCKET).file(`t/${fileName}`).delete({ ignoreNotFound: true })

		const userList = await List.findOne({ addedBy: req.user._id }).select('list').lean()
		const idx = userList.list.findIndex((obj) => obj.bggId === bggId)
		userList.list[idx].userImage = null
		await List.updateOne({ _id: userList._id }, { list: userList.list })

		res.status(204).end()
	} catch (error) {
		res.status(503)
		throw { message: 'Error while removing image. Try again' }
	}
})

// ~ @desc    Get sale / trade / wanted games that are active
// ~ @route   GET /api/games
// ~ @access  Private route
const getGames = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const search = req.query.search
	const sortBy = req.query.sort
	const mode = req.query.mode
	const resultsPerPage = 18

	console.log(page, search, sortBy, mode, resultsPerPage)

	if (search) {
		const gamesData = await Game.find({ isActive: true, mode })
			.populate('addedBy', 'username _id avatar')
			.select(
				'-extraInfoPack -__v -_id -games.categories -games.extraInfo -games.isSleeved -games.languageDependence -games.mechanics -games.userImage -games.versions -games.expansions -games.parent -games.description -games.maxPlayers -games.minPlayers -games.minAge -games.playTime -games.suggestedPlayers'
			)
			.lean()

		const fuse = new Fuse(gamesData, {
			keys      : [ 'games.bggId', 'games.title', 'games.designers', 'games.subtype' ],
			threshold : 0.3,
			distance  : 200
		})

		const results = fuse.search(search).map((game) => game.item).sort((a, b) => {
			if (sortBy === 'new') {
				return b.createdAt - a.createdAt
			} else if (sortBy === 'updated') {
				return b.reactivatedAt - a.reactivatedAt
			} else if (sortBy === 'old') {
				return a.createdAt - b.createdAt
			} else if (sortBy === 'price-low') {
				return a.totalPrice - b.totalPrice
			} else if (sortBy === 'price-high') {
				return b.totalPrice - a.totalPrice
			} else if (sortBy === 'ratings') {
				return a.games[0].stats.ratings - b.games[0].stats.ratings
			} else if (sortBy === 'avgrating') {
				return b.games[0].stats.avgRating - a.games[0].stats.avgRating
			} else if (sortBy === 'release-new') {
				return b.games[0].year - a.games[0].year
			} else if (sortBy === 'release-old') {
				return a.games[0].year - b.games[0].year
			} else {
				return b.reactivatedAt - a.reactivatedAt
			}
		})

		const pagination = {
			page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		return res.status(200).json({
			gamesData  : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const checkSort = () => {
			if (sortBy === 'new') {
				return { createdAt: -1 }
			} else if (sortBy === 'updated') {
				return { reactivatedAt: -1 }
			} else if (sortBy === 'old') {
				return { createdAt: 1 }
			} else if (sortBy === 'price-low') {
				return { totalPrice: 1 }
			} else if (sortBy === 'price-high') {
				return { totalPrice: -1 }
			} else if (sortBy === 'ratings') {
				return { 'games.stats.ratings': -1 }
			} else if (sortBy === 'avgrating') {
				return { 'games.stats.avgRating': -1 }
			} else if (sortBy === 'release-new') {
				return { 'games.year': -1 }
			} else if (sortBy === 'release-old') {
				return { 'games.year': 1 }
			} else {
				return { reactivatedAt: -1 }
			}
		}

		const count = await Game.countDocuments({ isActive: true, mode })

		const gamesData = await Game.find({ isActive: true, mode })
			.skip(resultsPerPage * (page - 1))
			.limit(resultsPerPage)
			.populate('addedBy', 'username _id avatar')
			.select(
				'-extraInfoPack -__v -_id -games.categories -games.designers -games.extraInfo -games.isSleeved -games.languageDependence -games.mechanics -games.userImage -games.versions -games.expansions -games.parent -games.description -games.maxPlayers -games.minPlayers -games.minAge -games.playTime -games.suggestedPlayers'
			)
			.sort(checkSort())
			.lean()

		const pagination = {
			page,
			totalPages : Math.ceil(count / resultsPerPage),
			totalItems : count,
			perPage    : resultsPerPage
		}

		return res.status(200).json({ gamesData, pagination })
	}
})

// ~ @desc    Get all active user listed games for sale/trade/want
// ~ @route   GET /api/games/user/listed
// ~ @access  Private route
const getUserListedGames = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const search = req.query.search
	const resultsPerPage = 18

	const allUserGames = await Game.find({ addedBy: req.user._id })
		.select(
			'_id altId totalPrice extraInfoPack games.extraInfo reactivatedAt isActive isPack mode slug games.bggId games.year games.designers games.image games.thumbnail games.subtype games.title'
		)
		.lean()

	if (search) {
		const fuse = new Fuse(allUserGames, {
			keys      : [ 'games.bggId', 'games.title', 'games.designers', 'games.subtype' ],
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
			listedGames : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const games = await Game.find({ addedBy: req.user._id })
			.skip(resultsPerPage * (page - 1))
			.limit(resultsPerPage)
			.sort({ createdAt: -1 })
			.select(
				'_id altId totalPrice extraInfoPack games.extraInfo reactivatedAt isActive isPack mode slug games.bggId games.year games.designers games.image games.thumbnail games.subtype games.title'
			)
			.lean()

		const pagination = {
			page       : page,
			totalPages : Math.ceil(allUserGames.length / resultsPerPage),
			totalItems : allUserGames.length,
			perPage    : resultsPerPage
		}

		res.status(200).json({
			listedGames : games,
			pagination
		})
	}
})

// <> @desc    Reactivate one game
// <> @route   PATCH /api/games/:id/reactivate
// <> @access  Private route
const reactivateGame = asyncHandler(async (req, res) => {
	const { id } = req.params

	const gameExists = await Game.findById(id).select('_id games').lean()

	if (!gameExists) {
		res.status(404)
		throw {
			message : 'Game not found'
		}
	}

	// Update thumbnail,image,suggestedPlayers,languagedep,stats,complexity,expansions
	try {
		const { data } = await axios.get('https://api.geekdo.com/xmlapi2/thing', {
			params : {
				id    : gameExists.games.map((game) => game.bggId).join(','),
				stats : 1
			}
		})

		const { item } = await parseXML(data)
		const ensureArray = Array.isArray(item) ? item : [ item ]
		const gamesArr = []

		for (let game of ensureArray) {
			const item = {
				bggId              : game.id,
				thumbnail          : game.thumbnail || null,
				image              : game.image || null,
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
						: null
					: null,
				stats              : {
					ratings   : +game.statistics.ratings.usersrated.value,
					avgRating : +parseFloat(game.statistics.ratings.average.value).toFixed(2),
					rank      :
						game.type === 'boardgame'
							? Array.isArray(game.statistics.ratings.ranks.rank)
								? +game.statistics.ratings.ranks.rank.find((obj) => +obj.id === 1).value
								: +[ game.statistics.ratings.ranks.rank ].find((obj) => +obj.id === 1).value
							: null
				},
				complexity         : {
					weight :
						+game.statistics.ratings.numweights.value > 0
							? +parseFloat(game.statistics.ratings.averageweight.value).toFixed(2)
							: null,
					votes  : +game.statistics.ratings.numweights.value
				},
				expansions         :
					game.type === 'boardgame'
						? game.link.filter((link) => link.type === 'boardgameexpansion').map((exp) => {
								return { bggId: exp.id, title: exp.value }
							})
						: []
			}
			gamesArr.push(item)
		}

		const newData = []
		for (let game of gameExists.games) {
			newData.push({ ...game, ...gamesArr.find((obj) => obj.bggId === game.bggId) })
		}

		await Game.updateOne({ _id: id }, { isActive: true, reactivatedAt: Date.now(), games: newData })

		return res.status(204).end()
	} catch (error) {
		console.error(error)
		// Daca eroare, macar reactivare cu datele vechi
		await Game.updateOne({ _id: id }, { isActive: true, reactivatedAt: Date.now() })
		return res.status(204).end()
	}
})

// ~ @desc    Get single game details
// ~ @route   GET /api/games/:altId
// ~ @access  Private route
const getSingleGame = asyncHandler(async (req, res) => {
	const { altId } = req.params
	const game = await Game.findOne({ altId }).where('mode').populate('addedBy', 'username _id avatar').lean()

	if (!game) {
		res.status(404)
		throw {
			message : 'Listing not found'
		}
	}

	if (!game.isActive) {
		res.status(404)
		throw {
			message : 'Listing is not active'
		}
	}

	return res.status(200).json(game)
})

// ! @desc    Delete one saved game
// ! @route   DELETE /api/games/:altId/save
// ! @access  Private route
const deleteSavedGame = asyncHandler(async (req, res) => {
	const { altId } = req.params

	const game = await Game.findOne({ altId }).select('_id addedBy').lean()

	if (!game) {
		res.status(404)
		throw {
			message : 'Game not found'
		}
	}

	const user = await User.findById({ _id: req.user._id }).select('savedGames').lean()

	const filtered = user.savedGames.filter((id) => id.toString() !== game._id.toString())
	await User.updateOne({ _id: req.user._id }, { savedGames: filtered })
	return res.status(204).end()
})

// <> @desc    Save game
// <> @route   PATCH  /api/games/:altId/save
// <> @access  Private route
const switchSaveGame = asyncHandler(async (req, res) => {
	const { altId } = req.params
	const game = await Game.findOne({ altId }).select('_id addedBy').lean()

	if (!game) {
		res.status(404)
		throw {
			message : 'Game not found'
		}
	}

	if (game.addedBy.toString() === req.user._id.toString()) {
		res.status(400)
		throw {
			message : 'You cannot save/unsave your own listing'
		}
	}

	const user = await User.findById({ _id: req.user._id }).select('savedGames').lean()

	if (!user) {
		res.status(404)
		throw {
			message : 'User not found'
		}
	}

	if (user.savedGames.map((id) => id.toString()).indexOf(game._id.toString()) === -1) {
		user.savedGames.unshift(game._id)
		await User.updateOne({ _id: req.user._id }, { savedGames: user.savedGames })
		return res.status(200).send({ isSaved: true })
	} else {
		const filtered = user.savedGames.filter((id) => id.toString() !== game._id.toString())
		await User.updateOne({ _id: req.user._id }, { savedGames: filtered })
		return res.status(200).send({ isSaved: false })
	}
})

// ~ @desc    Get one saved games
// ~ @route   GET /api/games/:altId/save
// ~ @access  Private route
const getSingleGameSavedStatus = asyncHandler(async (req, res) => {
	const { altId } = req.params

	const user = await User.findById({ _id: req.user._id })
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
		res.status(200).send({ isSaved: true })
	} else {
		res.status(200).send({ isSaved: false })
	}
})

// ~ @desc    Get saved games
// ~ @route   GET /api/games/saved
// ~ @access  Private route
const getSavedGames = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const search = req.query.search
	const resultsPerPage = 18

	const savedGamesList = await User.findById({ _id: req.user._id })
		.select('savedGames')
		.populate({
			path   : 'savedGames',
			select :
				'_id altId isActive isPack mode slug games.bggId games.year games.designers games.image games.thumbnail games.subtype games.title'
		})
		.lean()

	if (!savedGamesList) {
		res.status(404)
		throw {
			message : 'User not found'
		}
	}

	if (search) {
		const fuse = new Fuse(savedGamesList.savedGames, {
			keys      : [ 'games.bggId', 'games.title', 'games.designers', 'games.subtype' ],
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
				select :
					'_id altId isActive isPack mode slug games.bggId games.year  games.designers games.image games.thumbnail games.subtype games.title',
				limit  : resultsPerPage,
				sort   : { createdAt: -1 },
				skip   : resultsPerPage * (page - 1)
			}
		})

		const pagination = {
			page       : page,
			totalPages : Math.ceil(savedGamesList.savedGames.length / resultsPerPage),
			totalItems : savedGamesList.savedGames.length,
			perPage    : resultsPerPage
		}

		res.status(200).json({
			list       : savedGames,
			pagination
		})
	}
})

// ! @desc    Delete one game
// ! @route   DELETE /api/games/:id/delete
// ! @access  Private route
const deleteOneGame = asyncHandler(async (req, res) => {
	const { id } = req.params
	const game = await Game.findOneAndDelete({ _id: id }).lean()

	if (!game) {
		res.status(404)
		throw {
			message : 'Game not found'
		}
	}

	for (let obj of game.games) {
		if (obj.userImage) {
			await storage
				.bucket(process.env.IMG_BUCKET)
				.file(`f/${obj.userImage.name}`)
				.delete({ ignoreNotFound: true })
			await storage
				.bucket(process.env.IMG_BUCKET)
				.file(`t/${obj.userImage.name}`)
				.delete({ ignoreNotFound: true })
		}
	}

	res.status(204).end()

	// Create notification for users that added this listing to their saved games
	const users = await User.find({ savedGames: id }).select('_id savedGames').lean()
	if (users.length > 0) {
		let notifArr = []
		for (let user of users) {
			notifArr.push({
				recipient : user._id,
				type      : 'saved',
				text      : game.isPack
					? `One of your saved boardgame packs containing ${game.games
							.map((game) => game.title)
							.join(', ')} is no longer available for ${game.mode === 'sell' ? 'sale' : 'trade'}`
					: `One of your saved boardgames (${game.games[0].title}) is no longer available for ${game.mode ===
						'sell'
							? 'sale'
							: 'trade'}`,
				meta      : {
					thumbnail : game.games[0].thumbnail
				}
			})
		}

		for (let user of users) {
			const newSavedGamesArr = user.savedGames.filter((gameId) => gameId.toString() !== id.toString())
			await User.updateOne({ _id: user._id }, { savedGames: newSavedGamesArr })
		}
		await Notification.insertMany(notifArr)
		notifArr = []
	}
})

// ~ @desc    Get latest 12 games for homepage
// ~ @route   GET /api/games/saved
// ~ @access  Private route
const getNewListings = asyncHandler(async (req, res) => {
	const gamesData = await Game.find({ isActive: true, mode: { $in: [ 'sell', 'trade', 'want' ] } })
		.limit(12)
		.select('games totalPrice altId isPack mode createdAt')
		.sort({ createdAt: -1 })
		.lean()

	res.status(200).json(gamesData)
})

export {
	listSaleGames,
	listTradeGames,
	listWantedGames,
	getGames,
	getSingleGame,
	switchSaveGame,
	getSavedGames,
	getSingleGameSavedStatus,
	deleteSavedGame,
	getUserListedGames,
	deleteOneGame,
	reactivateGame,
	uploadImage,
	deleteImage,
	getNewListings
}
