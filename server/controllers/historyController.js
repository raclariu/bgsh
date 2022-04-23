import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Fuse from 'fuse.js'
import User from '../models/userModel.js'
import Game from '../models/gameModel.js'
import History from '../models/historyModel.js'
import Notification from '../models/notificationModel.js'
import storage from '../helpers/storage.js'

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
		return {
			bggId     : game.bggId,
			title     : game.title,
			thumbnail : game.thumbnail,
			image     : game.image,
			year      : game.year,
			subtype   : game.subtype,
			version   : game.version
		}
	})

	const gameExists = await Game.findOne({ _id: gameId }).select('isActive isPack mode').lean()

	if (gameExists) {
		if (gameExists.isActive === false) {
			res.status(404)
			throw {
				message : 'Game is not active'
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
			for (let game of games) {
				if (game.userImage) {
					await storage
						.bucket(process.env.IMG_BUCKET)
						.file(`f/${game.userImage.name}`)
						.delete({ ignoreNotFound: true })
					await storage
						.bucket(process.env.IMG_BUCKET)
						.file(`t/${game.userImage.name}`)
						.delete({ ignoreNotFound: true })
				}
			}
			await Game.findOneAndDelete({ _id: gameId })
			res.status(204).end()

			// Create notification for users that added this listing to their saved games
			const users = await User.find({ savedGames: gameId }).select('_id savedGames').lean()
			if (users.length > 0) {
				let notifArr = []
				for (let user of users) {
					notifArr.push({
						recipient : user._id,
						type      : 'saved',
						text      : gameExists.isPack
							? `One of your saved boardgame packs containing ${simplifyGames
									.map((game) => game.title)
									.join(', ')} is no longer available for sale`
							: `One of your saved boardgames (${simplifyGames[0]
									.title}) is no longer available for sale`,
						meta      : {
							thumbnail : simplifyGames[0].thumbnail
						}
					})
				}

				for (let user of users) {
					const newSavedGamesArr = user.savedGames.filter((id) => id.toString() !== gameId.toString())
					await User.updateOne({ _id: user._id }, { savedGames: newSavedGamesArr })
				}
				await Notification.insertMany(notifArr)
				notifArr = []
			}

			// Create notification if otherUsername is presened
			if (req.otherUsernameId) {
				await Notification.create({
					recipient : req.otherUsernameId,
					type      : 'history',
					text      : gameExists.isPack
						? `${req.user.username} added your username when adding a pack containing ${simplifyGames
								.map((game) => game.title)
								.join(', ')} to sale history`
						: `${req.user.username} referenced you when adding a game (${simplifyGames[0]
								.title}) to sale history`,
					meta      : {
						thumbnail : simplifyGames[0].thumbnail
					}
				})
			}
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
		return {
			bggId     : game.bggId,
			title     : game.title,
			thumbnail : game.thumbnail,
			image     : game.image,
			year      : game.year,
			subtype   : game.subtype,
			version   : game.version
		}
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
			for (let game of games) {
				if (game.userImage) {
					await storage
						.bucket(process.env.IMG_BUCKET)
						.file(`f/${game.userImage.name}`)
						.delete({ ignoreNotFound: true })
					await storage
						.bucket(process.env.IMG_BUCKET)
						.file(`t/${game.userImage.name}`)
						.delete({ ignoreNotFound: true })
				}
			}
			await Game.findOneAndDelete({ _id: gameId })
			res.status(204).end()

			// Create notification for users that added this listing to their saved games
			const users = await User.find({ savedGames: gameId }).select('_id savedGames').lean()
			if (users.length > 0) {
				let notifArr = []
				for (let user of users) {
					notifArr.push({
						recipient : user._id,
						type      : 'saved',
						text      : gameExists.isPack
							? `One of your saved boardgame packs containing ${simplifyGames
									.map((game) => game.title)
									.join(', ')} is no longer available for trade`
							: `One of your saved boardgames (${simplifyGames[0]
									.title}) is no longer available for trade`,
						meta      : {
							thumbnail : simplifyGames[0].thumbnail
						}
					})
				}

				for (let user of users) {
					const newSavedGamesArr = user.savedGames.filter((id) => id.toString() !== gameId.toString())
					await User.updateOne({ _id: user._id }, { savedGames: newSavedGamesArr })
				}
				await Notification.insertMany(notifArr)
				notifArr = []
			}

			// Create notification if otherUsername is presened
			if (req.otherUsernameId) {
				await Notification.create({
					recipient : req.otherUsernameId,
					type      : 'history',
					text      : gameExists.isPack
						? `${req.user
								.username} referenced your username when adding a pack containing ${simplifyGames
								.map((game) => game.title)
								.join(', ')} to trade history`
						: `${req.user.username} referenced you when adding a game (${simplifyGames[0]
								.title}) to trade history`,
					meta      : {
						thumbnail : simplifyGames[0].thumbnail
					}
				})
			}
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
					bggId     : game.bggId,
					subtype   : game.subtype,
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

		// Create notification if otherUsername is present
		if (req.otherUsernameId) {
			await Notification.create({
				recipient : req.otherUsernameId,
				type      : 'history',
				text      : `${req.user.username} referenced your username when adding a pack containing ${games
					.map((game) => game.title)
					.join(', ')} to buy history`,
				meta      : {
					thumbnail : games[0].thumbnail
				}
			})
		}
	} else {
		const buyList = []
		const notifArr = []
		for (let game of games) {
			const otherUser = game.otherUsername
				? await User.findOne({ username: game.otherUsername }).select('_id').lean()
				: null
			const data = {
				mode       : 'buy',
				isPack     : false,
				games      : [
					{
						bggId     : game.bggId,
						subtype   : game.subtype,
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
				otherUser  : otherUser ? otherUser._id : null,
				finalPrice : game.price
			}
			buyList.push(data)

			// Create notification if otherUser is present
			if (otherUser) {
				notifArr.push({
					recipient : otherUser._id,
					type      : 'history',
					text      : `${req.user.username} referenced you when adding a game (${game.title}) to buy history`,
					meta      : {
						thumbnail : game.thumbnail
					}
				})
			}
		}

		await History.insertMany(buyList)
		await Notification.insertMany(notifArr)
	}

	return res.status(204).end()
})

// ~ @desc    Get user games history
// ~ @route   GET  /api/history
// ~ @access  Private route
const getGamesHistory = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const search = req.query.search
	const resultsPerPage = 18
	const mode = req.query.mode

	const completeList = await History.find({ addedBy: req.user._id, mode })
		.populate('otherUser', 'username _id avatar')
		.sort({ createdAt: -1 })
		.lean()

	if (completeList.length === 0) {
		return res.status(200).json({ historyList: [], pagination: {} })
	}

	if (search) {
		const fuse = new Fuse(completeList, {
			keys      : [ 'games.title', 'games.subtype' ],
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
			.populate('otherUser', 'username _id avatar')
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
