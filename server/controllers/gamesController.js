import { validationResult } from 'express-validator'
import Fuse from 'fuse.js'
import asyncHandler from 'express-async-handler'
import Game from '../models/gameModel.js'
import User from '../models/userModel.js'
import Notification from '../models/notificationModel.js'
import Wishlist from '../models/wishlistModel.js'
import List from '../models/listModel.js'
import storage from '../helpers/storage.js'
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
		await Game.create({
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
			totalPrice,
			extraInfoPack,
			isPack
		})

		return res.status(204).end()
	} else {
		let sellList = []
		games.forEach((game, index) => {
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
				isPack
			}
			sellList.push(data)
		})

		const insertedGames = await Game.insertMany(sellList)
		res.status(204).end()

		let notifArr = []
		for (let data of insertedGames) {
			const { bggId } = data.games[0]
			const foundUserWishlist = await Wishlist.find({ 'wishlist.bggId': bggId }).select('user').lean()
			if (foundUserWishlist.length > 0) {
				if (!foundUserWishlist.some((obj) => obj.user.toString() === req.user._id.toString())) {
					for (let obj of foundUserWishlist) {
						notifArr.push({
							sender    : req.user._id,
							recipient : obj.user,
							type      : 'wishlist',
							text      : `${data.games[0].title}`,
							meta      : {
								altId : data.altId
							}
						})
					}
					await Notification.insertMany(notifArr)
					notifArr = []
				}
			}
		}
	}
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
		await Game.create({
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
			isPack
		})
	} else {
		let tradeList = []
		for (let game of games) {
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
				isPack
			}
			tradeList.push(data)
		}

		await Game.insertMany(tradeList)
	}

	return res.status(204).end()
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

	const { games, shipPreffered } = req.body

	let wantedList = []
	for (let game of games) {
		let data = {
			mode     : 'want',
			addedBy  : req.user._id,
			games    : [ game ],
			shipping : {
				shipPreffered
			},
			isPack   : false
		}
		wantedList.push(data)
	}
	await Game.insertMany(wantedList)

	return res.status(204).end()
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

	if (search) {
		const gamesData = await Game.find({ isActive: true, mode }).populate('addedBy', 'username _id avatar').lean()

		const fuse = new Fuse(gamesData, {
			keys      : [ 'games.bggId', 'games.title', 'games.designers' ],
			threshold : 0.3,
			distance  : 200
		})
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
			} else {
				return b.createdAt - a.createdAt
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
			} else if (sortBy === 'old') {
				return { createdAt: 1 }
			} else if (sortBy === 'price-low') {
				return { totalPrice: 1 }
			} else if (sortBy === 'price-high') {
				return { totalPrice: -1 }
			} else if (sortBy === 'rank') {
				return { 'games.stats.rank': 1 }
			} else if (sortBy === 'year') {
				return { 'games.year': -1 }
			} else {
				return { createdAt: -1 }
			}
		}

		const count = await Game.countDocuments({ isActive: true, mode })

		const gamesData = await Game.find({ isActive: true, mode })
			.skip(resultsPerPage * (page - 1))
			.limit(resultsPerPage)
			.populate('addedBy', 'username _id avatar')
			.sort(checkSort())
			.lean()

		const pagination = {
			page,
			totalPages   : Math.ceil(count / resultsPerPage),
			totalItems   : count,
			itemsPerPage : resultsPerPage
		}

		return res.status(200).json({ gamesData, pagination })
	}
})

// ~ @desc    Get all active games listed for sale or trade for one single user
// ~ @route   GET /api/games/user/:id
// ~ @access  Private route
const getUserListedGames = asyncHandler(async (req, res) => {
	const { id } = req.params
	const page = +req.query.page
	const search = req.query.search
	const resultsPerPage = 18

	const allUserGames = await Game.find({ addedBy: id }).lean()

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

		return res.status(200).json({
			listedGames : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const games = await Game.find({ addedBy: id })
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

	const gameExists = await Game.findById(id).select('_id')

	if (gameExists) {
		await Game.updateOne({ _id: id }, { isActive: true })

		return res.status(204).end()
	} else {
		res.status(404)
		throw {
			message : 'Game not found'
		}
	}
})

// ~ @desc    Get single game details
// ~ @route   GET /api/games/:altId
// ~ @access  Private route
const getSingleGame = asyncHandler(async (req, res) => {
	const { altId } = req.params
	const game = await Game.findOne({ altId })
		.where('mode')
		.ne('want')
		.populate('addedBy', 'username _id avatar')
		.lean()

	if (!game) {
		res.status(404)
		throw {
			message : 'Game not found'
		}
	}

	if (!game.isActive) {
		res.status(404)
		throw {
			message : 'Game is no longer available'
		}
	}

	return res.status(200).json(game)
})

// <> @desc    Save game
// <> @route   PATCH  /api/games/:altId/save
// <> @access  Private route
const switchSaveGame = asyncHandler(async (req, res) => {
	const { altId } = req.params
	const game = await Game.findOne({ altId }).select('_id').lean()

	if (!game) {
		res.status(404)
		throw {
			message : 'Game not found'
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

	const user = await User.findById({ _id: req.user._id }).select('savedGames').populate('savedGames').lean()

	if (!user) {
		res.status(404)
		throw {
			message : 'User not found'
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
// ! @route   DELETE /api/games/:id/delete
// ! @access  Private route
const deleteOneGame = asyncHandler(async (req, res) => {
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
	listSaleGames,
	listTradeGames,
	listWantedGames,
	getGames,
	getSingleGame,
	switchSaveGame,
	getSavedGames,
	getSingleGameSavedStatus,
	getUserListedGames,
	deleteOneGame,
	reactivateGame,
	uploadImage,
	deleteImage
}
