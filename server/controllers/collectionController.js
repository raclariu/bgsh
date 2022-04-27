import axios from 'axios'
import asyncHandler from 'express-async-handler'
import Fuse from 'fuse.js'
import Owned from '../models/collectionModels/ownedModel.js'
import ForTrade from '../models/collectionModels/forTradeModel.js'
import WantInTrade from '../models/collectionModels/wantInTradeModel.js'
import WantToBuy from '../models/collectionModels/wantToBuyModel.js'
import WantToPlay from '../models/collectionModels/wantToPlayModel.js'
import Wishlist from '../models/collectionModels/wishlistModel.js'
import { parseXML } from '../helpers/helpers.js'

// * @desc    Get collection from BGG and add to DB
// * @route   POST  /api/collections
// * @access  Private route
const updateBggCollection = asyncHandler(async (req, res) => {
	try {
		const { bggUsername } = req.body

		// https://api.geekdo.com/xmlapi2/collection?username=sergiunastrut&prevowned=0&excludesubtype=boardgameexpansion

		// Lasam si prev owned ca unii le au la want dar si la prev owned
		// de luat si numplays

		const { data: boardGamesCollection } = await axios.get('https://api.geekdo.com/xmlapi2/collection', {
			params : {
				username       : bggUsername,
				subtype        : 'boardgame',
				version        : 1,
				stats          : 1,
				excludesubtype : 'boardgameexpansion'
			}
		})

		const { data: expansionsCollection } = await axios.get('https://api.geekdo.com/xmlapi2/collection', {
			params : {
				username : bggUsername,
				subtype  : 'boardgameexpansion',
				version  : 1,
				stats    : 1
			}
		})

		let jsonBgCollection = await parseXML(boardGamesCollection)
		let jsonExpCollection = await parseXML(expansionsCollection)

		// ensure owned boardgames is array if total items is 0,1 or more
		const ensureJsonBgCollectionIsArray =
			jsonBgCollection.totalitems === '0'
				? []
				: Array.isArray(jsonBgCollection.item) ? jsonBgCollection.item : [ jsonBgCollection.item ]

		// ensure owned expansions is array if total items is 0,1 or more
		const ensureJsonExpCollectionIsArray =
			jsonExpCollection.totalitems === '0'
				? []
				: Array.isArray(jsonExpCollection.item) ? jsonExpCollection.item : [ jsonExpCollection.item ]

		const fullOwnedCollection = ensureJsonBgCollectionIsArray
			.filter((item) => item.status.own === '1')
			.concat(ensureJsonExpCollectionIsArray.filter((item) => item.status.own === '1'))

		const fullForTradeCollection = ensureJsonBgCollectionIsArray
			.filter((item) => item.status.fortrade === '1')
			.concat(ensureJsonExpCollectionIsArray.filter((item) => item.status.fortrade === '1'))

		const fullWantInTradeCollection = ensureJsonBgCollectionIsArray
			.filter((item) => item.status.want === '1')
			.concat(ensureJsonExpCollectionIsArray.filter((item) => item.status.want === '1'))

		const fullWantToBuyCollection = ensureJsonBgCollectionIsArray
			.filter((item) => item.status.wanttobuy === '1')
			.concat(ensureJsonExpCollectionIsArray.filter((item) => item.status.wanttobuy === '1'))

		const fullWantToPlayCollection = ensureJsonBgCollectionIsArray
			.filter((item) => item.status.wanttoplay === '1')
			.concat(ensureJsonExpCollectionIsArray.filter((item) => item.status.wanttoplay === '1'))

		const fullWishlistCollection = ensureJsonBgCollectionIsArray
			.filter((item) => item.status.wishlist === '1')
			.concat(ensureJsonExpCollectionIsArray.filter((item) => item.status.wishlist === '1'))

		let ownedArr = []
		if (fullOwnedCollection.length > 0) {
			for (let game of fullOwnedCollection) {
				const gameObj = {
					bggId     : game.objectid,
					subtype   : game.subtype === 'boardgame' ? 'boardgame' : 'expansion',
					title     : game.originalname ? game.originalname : game.name._ || null,
					year      : game.yearpublished ? +game.yearpublished : null,
					thumbnail : game.thumbnail ? game.thumbnail : null,
					image     : game.image ? game.image : null,
					modified  : game.status.lastmodified,
					stats     : {
						userRating :
							game.stats.rating.value && !isNaN(game.stats.rating.value)
								? +parseFloat(game.stats.rating.value).toFixed(2)
								: null,
						avgRating  : +parseFloat(game.stats.rating.average.value).toFixed(2),
						ratings    : +game.stats.rating.usersrated.value
					},
					numPlays  : +game.numplays,
					version   : !game.version
						? null
						: game.version.item
							? {
									title : Array.isArray(game.version.item.name)
										? game.version.item.name.find((obj) => obj.type === 'primary').value
										: !Array.isArray(game.version.item.name) ? game.version.item.name.value : null,

									year  : +game.version.item.yearpublished.value
										? +game.version.item.yearpublished.value
										: null
								}
							: null
				}

				ownedArr.push(gameObj)
			}
		}

		let forTradeArr = []
		if (fullForTradeCollection.length > 0) {
			for (let game of fullForTradeCollection) {
				const gameObj = {
					bggId     : game.objectid,
					subtype   : game.subtype === 'boardgame' ? 'boardgame' : 'expansion',
					title     : game.originalname ? game.originalname : game.name._ || null,
					year      : game.yearpublished ? +game.yearpublished : null,
					thumbnail : game.thumbnail ? game.thumbnail : null,
					image     : game.image ? game.image : null,
					modified  : game.status.lastmodified,
					stats     : {
						userRating :
							game.stats.rating.value && !isNaN(game.stats.rating.value)
								? +parseFloat(game.stats.rating.value).toFixed(2)
								: null,
						avgRating  : +parseFloat(game.stats.rating.average.value).toFixed(2),
						ratings    : +game.stats.rating.usersrated.value
					},
					numPlays  : +game.numplays,
					version   : !game.version
						? null
						: game.version.item
							? {
									title : Array.isArray(game.version.item.name)
										? game.version.item.name.find((obj) => obj.type === 'primary').value
										: !Array.isArray(game.version.item.name) ? game.version.item.name.value : null,

									year  : +game.version.item.yearpublished.value
										? +game.version.item.yearpublished.value
										: null
								}
							: null
				}

				forTradeArr.push(gameObj)
			}
		}

		let wantInTradeArr = []
		if (fullWantInTradeCollection.length > 0) {
			for (let game of fullWantInTradeCollection) {
				const gameObj = {
					bggId     : game.objectid,
					subtype   : game.subtype === 'boardgame' ? 'boardgame' : 'expansion',
					title     : game.originalname ? game.originalname : game.name._ || null,
					year      : game.yearpublished ? +game.yearpublished : null,
					thumbnail : game.thumbnail ? game.thumbnail : null,
					image     : game.image ? game.image : null,
					numPlays  : +game.numplays,
					modified  : game.status.lastmodified,
					stats     : {
						userRating :
							game.stats.rating.value && !isNaN(game.stats.rating.value)
								? +parseFloat(game.stats.rating.value).toFixed(2)
								: null,
						avgRating  : +parseFloat(game.stats.rating.average.value).toFixed(2),
						ratings    : +game.stats.rating.usersrated.value
					}
				}

				wantInTradeArr.push(gameObj)
			}
		}

		let wantToBuyArr = []
		if (fullWantToBuyCollection.length > 0) {
			for (let game of fullWantToBuyCollection) {
				const gameObj = {
					bggId     : game.objectid,
					subtype   : game.subtype === 'boardgame' ? 'boardgame' : 'expansion',
					title     : game.originalname ? game.originalname : game.name._ || null,
					year      : game.yearpublished ? +game.yearpublished : null,
					thumbnail : game.thumbnail ? game.thumbnail : null,
					image     : game.image ? game.image : null,
					numPlays  : +game.numplays,
					modified  : game.status.lastmodified,
					stats     : {
						userRating :
							game.stats.rating.value && !isNaN(game.stats.rating.value)
								? +parseFloat(game.stats.rating.value).toFixed(2)
								: null,
						avgRating  : +parseFloat(game.stats.rating.average.value).toFixed(2),
						ratings    : +game.stats.rating.usersrated.value
					}
				}

				wantToBuyArr.push(gameObj)
			}
		}

		let wantToPlayArr = []
		if (fullWantToPlayCollection.length > 0) {
			for (let game of fullWantToPlayCollection) {
				const gameObj = {
					bggId     : game.objectid,
					subtype   : game.subtype === 'boardgame' ? 'boardgame' : 'expansion',
					title     : game.originalname ? game.originalname : game.name._ || null,
					year      : game.yearpublished ? +game.yearpublished : null,
					thumbnail : game.thumbnail ? game.thumbnail : null,
					image     : game.image ? game.image : null,
					numPlays  : +game.numplays,
					modified  : game.status.lastmodified,
					stats     : {
						userRating :
							game.stats.rating.value && !isNaN(game.stats.rating.value)
								? +parseFloat(game.stats.rating.value).toFixed(2)
								: null,
						avgRating  : +parseFloat(game.stats.rating.average.value).toFixed(2),
						ratings    : +game.stats.rating.usersrated.value
					}
				}

				wantToPlayArr.push(gameObj)
			}
		}

		let wishlistArr = []
		if (fullWishlistCollection.length > 0) {
			for (let game of fullWishlistCollection) {
				const gameObj = {
					bggId     : game.objectid,
					subtype   : game.subtype === 'boardgame' ? 'boardgame' : 'expansion',
					title     : game.name ? game.name._ : null,
					year      : game.yearpublished ? +game.yearpublished : null,
					thumbnail : game.thumbnail ? game.thumbnail : null,
					image     : game.image ? game.image : null,
					priority  : +game.status.wishlistpriority,
					numPlays  : +game.numplays,
					modified  : game.status.lastmodified,
					stats     : {
						userRating :
							game.stats.rating.value && !isNaN(game.stats.rating.value)
								? +parseFloat(game.stats.rating.value).toFixed(2)
								: null,
						avgRating  : +parseFloat(game.stats.rating.average.value).toFixed(2),
						ratings    : +game.stats.rating.usersrated.value
					}
				}

				wishlistArr.push(gameObj)
			}
		}

		// console.log(ownedArr, forTradeArr, wantInTradeArr, wantToBuyArr, wantToPlayArr, wishlistArr)

		const ownedExist = await Owned.findOne({ user: req.user._id }).select('_id').lean()
		if (ownedExist) {
			await Owned.deleteOne({ user: req.user._id })
		}

		const forTradeExist = await ForTrade.findOne({ user: req.user._id }).select('_id').lean()
		if (forTradeExist) {
			await ForTrade.deleteOne({ user: req.user._id })
		}

		const wantInTradeExist = await WantInTrade.findOne({ user: req.user._id }).select('_id').lean()
		if (wantInTradeExist) {
			await WantInTrade.deleteOne({ user: req.user._id })
		}

		const wantToBuyExist = await WantToBuy.findOne({ user: req.user._id }).select('_id').lean()
		if (wantToBuyExist) {
			await WantToBuy.deleteOne({ user: req.user._id })
		}

		const wantToPlayExist = await WantToPlay.findOne({ user: req.user._id }).select('_id').lean()
		if (wantToPlayExist) {
			await WantToPlay.deleteOne({ user: req.user._id })
		}

		const wishlistExist = await Wishlist.findOne({ user: req.user._id }).select('_id').lean()
		if (wishlistExist) {
			await Wishlist.deleteOne({ user: req.user._id })
		}

		await Owned.create({
			user        : req.user._id,
			bggUsername,
			owned       : ownedArr.length > 0 ? ownedArr.sort((a, b) => (a.title > b.title ? 1 : -1)) : [],
			ownedCount  : ownedArr.length
		})

		await ForTrade.create({
			user          : req.user._id,
			bggUsername,
			forTrade      : forTradeArr.length > 0 ? forTradeArr.sort((a, b) => (a.title > b.title ? 1 : -1)) : [],
			forTradeCount : forTradeArr.length
		})

		await WantInTrade.create({
			user             : req.user._id,
			bggUsername,
			wantInTrade      :
				wantInTradeArr.length > 0 ? wantInTradeArr.sort((a, b) => (a.title > b.title ? 1 : -1)) : [],
			wantInTradeCount : wantInTradeArr.length
		})

		await WantToBuy.create({
			user           : req.user._id,
			bggUsername,
			wantToBuy      : wantToBuyArr.length > 0 ? wantToBuyArr.sort((a, b) => (a.title > b.title ? 1 : -1)) : [],
			wantToBuyCount : wantToBuyArr.length
		})

		await WantToPlay.create({
			user            : req.user._id,
			bggUsername,
			wantToPlay      :
				wantToPlayArr.length > 0 ? wantToPlayArr.sort((a, b) => (a.title > b.title ? 1 : -1)) : [],
			wantToPlayCount : wantToPlayArr.length
		})

		await Wishlist.create({
			user          : req.user._id,
			bggUsername,
			wishlist      : wishlistArr.length > 0 ? wishlistArr.sort((a, b) => (a.title > b.title ? 1 : -1)) : [],
			wishlistCount : wishlistArr.length
		})

		return res.status(204).end()
	} catch (error) {
		res.status(500)
		throw {
			message : 'Failed to retrieve collection data from BGG. Try again',
			devErr  : error.stack
		}
	}
})

// ~ @desc    Get owned games from DB
// ~ @route   GET  /api/collections/owned
// ~ @access  Private route
const getOwned = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const resultsPerPage = 18
	const search = req.query.search

	const getOwnedCount = await Owned.findOne({ user: req.user._id }).select('ownedCount').lean()

	if (!getOwnedCount) {
		return res
			.status(200)
			.json({ collection: [], pagination: { page, totalPages: 0, totalItems: 0, perPage: resultsPerPage } })
	}

	if (getOwnedCount.ownedCount === 0) {
		return res
			.status(200)
			.json({ collection: [], pagination: { page, totalPages: 0, totalItems: 0, perPage: resultsPerPage } })
	}

	if (search) {
		const { owned } = await Owned.findOne({ user: req.user._id }).select('owned').lean()

		const fuse = new Fuse(owned, { keys: [ 'title', 'subtype', 'bggId' ], threshold: 0.3, distance: 200 })

		const results = fuse.search(search).map((game) => game.item)

		const pagination = {
			page       : page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		return res.status(200).json({
			collection : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const { owned, ownedCount } = await Owned.findOne({ user: req.user._id })
			.select('owned')
			.where('owned')
			.slice([ resultsPerPage * (page - 1), resultsPerPage ])
			.lean()

		const pagination = {
			page       : page,
			totalPages : Math.ceil(ownedCount / resultsPerPage),
			totalItems : ownedCount,
			perPage    : resultsPerPage
		}

		return res.status(200).json({
			collection : owned,
			pagination
		})
	}
})

// ~ @desc    Get forTrade games from DB
// ~ @route   GET  /api/collections/fortrade
// ~ @access  Private route
const getForTrade = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const resultsPerPage = 18
	const search = req.query.search

	const getForTradeCount = await ForTrade.findOne({ user: req.user._id }).select('forTradeCount').lean()

	if (!getForTradeCount) {
		return res
			.status(200)
			.json({ collection: [], pagination: { page, totalPages: 0, totalItems: 0, perPage: resultsPerPage } })
	}

	if (getForTradeCount.forTradeCount === 0) {
		return res
			.status(200)
			.json({ collection: [], pagination: { page, totalPages: 0, totalItems: 0, perPage: resultsPerPage } })
	}

	if (search) {
		const { forTrade } = await ForTrade.findOne({ user: req.user._id }).select('forTrade').lean()

		const fuse = new Fuse(forTrade, { keys: [ 'title', 'subtype', 'bggId' ], threshold: 0.3, distance: 200 })

		const results = fuse.search(search).map((game) => game.item)

		const pagination = {
			page       : page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		return res.status(200).json({
			collection : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const { forTrade, forTradeCount } = await ForTrade.findOne({ user: req.user._id })
			.select('forTrade')
			.where('forTrade')
			.slice([ resultsPerPage * (page - 1), resultsPerPage ])
			.lean()

		const pagination = {
			page       : page,
			totalPages : Math.ceil(forTradeCount / resultsPerPage),
			totalItems : forTradeCount,
			perPage    : resultsPerPage
		}

		return res.status(200).json({
			collection : forTrade,
			pagination
		})
	}
})

// ~ @desc    Get wantInTrade games from DB
// ~ @route   GET  /api/collections/wantintrade
// ~ @access  Private route
const getWantInTrade = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const resultsPerPage = 18
	const search = req.query.search

	const getWantInTradeCount = await WantInTrade.findOne({ user: req.user._id }).select('wantInTradeCount').lean()

	if (!getWantInTradeCount) {
		return res
			.status(200)
			.json({ collection: [], pagination: { page, totalPages: 0, totalItems: 0, perPage: resultsPerPage } })
	}

	if (getWantInTradeCount.wantInTradeCount === 0) {
		return res
			.status(200)
			.json({ collection: [], pagination: { page, totalPages: 0, totalItems: 0, perPage: resultsPerPage } })
	}

	if (search) {
		const { wantInTrade } = await WantInTrade.findOne({ user: req.user._id }).select('wantInTrade').lean()

		const fuse = new Fuse(wantInTrade, { keys: [ 'title', 'subtype', 'bggId' ], threshold: 0.3, distance: 200 })

		const results = fuse.search(search).map((game) => game.item)

		const pagination = {
			page       : page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		return res.status(200).json({
			collection : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const { wantInTrade, wantInTradeCount } = await WantInTrade.findOne({ user: req.user._id })
			.select('wantInTrade')
			.where('wantInTrade')
			.slice([ resultsPerPage * (page - 1), resultsPerPage ])
			.lean()

		const pagination = {
			page       : page,
			totalPages : Math.ceil(wantInTradeCount / resultsPerPage),
			totalItems : wantInTradeCount,
			perPage    : resultsPerPage
		}

		return res.status(200).json({
			collection : wantInTrade,
			pagination
		})
	}
})

// ~ @desc    Get wantInBuy games from DB
// ~ @route   GET  /api/collections/wanttobuy
// ~ @access  Private route
const getWantToBuy = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const resultsPerPage = 18
	const search = req.query.search

	const getWantToBuyCount = await WantToBuy.findOne({ user: req.user._id }).select('wantToBuyCount').lean()

	if (!getWantToBuyCount) {
		return res
			.status(200)
			.json({ collection: [], pagination: { page, totalPages: 0, totalItems: 0, perPage: resultsPerPage } })
	}

	if (getWantToBuyCount.wantToBuyCount === 0) {
		return res
			.status(200)
			.json({ collection: [], pagination: { page, totalPages: 0, totalItems: 0, perPage: resultsPerPage } })
	}

	if (search) {
		const { wantToBuy } = await WantToBuy.findOne({ user: req.user._id }).select('wantToBuy').lean()

		const fuse = new Fuse(wantToBuy, { keys: [ 'title', 'subtype', 'bggId' ], threshold: 0.3, distance: 200 })

		const results = fuse.search(search).map((game) => game.item)

		const pagination = {
			page       : page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		return res.status(200).json({
			collection : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const { wantToBuy, wantToBuyCount } = await WantToBuy.findOne({ user: req.user._id })
			.select('wantToBuy')
			.where('wantToBuy')
			.slice([ resultsPerPage * (page - 1), resultsPerPage ])
			.lean()

		const pagination = {
			page       : page,
			totalPages : Math.ceil(wantToBuyCount / resultsPerPage),
			totalItems : wantToBuyCount,
			perPage    : resultsPerPage
		}

		return res.status(200).json({
			collection : wantToBuy,
			pagination
		})
	}
})

// ~ @desc    Get wantInPlay games from DB
// ~ @route   GET  /api/collections/wanttoplay
// ~ @access  Private route
const getWantToPlay = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const resultsPerPage = 18
	const search = req.query.search

	const getWantToPlayCount = await WantToPlay.findOne({ user: req.user._id }).select('wantToPlayCount').lean()

	if (!getWantToPlayCount) {
		return res
			.status(200)
			.json({ collection: [], pagination: { page, totalPages: 0, totalItems: 0, perPage: resultsPerPage } })
	}

	if (getWantToPlayCount.wantToPlayCount === 0) {
		return res
			.status(200)
			.json({ collection: [], pagination: { page, totalPages: 0, totalItems: 0, perPage: resultsPerPage } })
	}

	if (search) {
		const { wantToPlay } = await WantToPlay.findOne({ user: req.user._id }).select('wantToPlay').lean()

		const fuse = new Fuse(wantToPlay, { keys: [ 'title', 'subtype', 'bggId' ], threshold: 0.3, distance: 200 })

		const results = fuse.search(search).map((game) => game.item)

		const pagination = {
			page       : page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		return res.status(200).json({
			collection : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const { wantToPlay, wantToPlayCount } = await WantToPlay.findOne({ user: req.user._id })
			.select('wantToPlay')
			.where('wantToPlay')
			.slice([ resultsPerPage * (page - 1), resultsPerPage ])
			.lean()

		const pagination = {
			page       : page,
			totalPages : Math.ceil(wantToPlayCount / resultsPerPage),
			totalItems : wantToPlayCount,
			perPage    : resultsPerPage
		}

		return res.status(200).json({
			collection : wantToPlay,
			pagination
		})
	}
})

// ~ @desc    Get wishlist from DB
// ~ @route   GET  /api/collections/wishlist
// ~ @access  Private route
const getWishlist = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const resultsPerPage = 18
	const search = req.query.search

	const getWishlistCount = await Wishlist.findOne({ user: req.user._id }).select('wishlistCount').lean()

	if (!getWishlistCount) {
		return res
			.status(200)
			.json({ collection: [], pagination: { page, totalPages: 0, totalItems: 0, perPage: resultsPerPage } })
	}

	if (getWishlistCount.wishlistCount === 0) {
		return res
			.status(200)
			.json({ collection: [], pagination: { page, totalPages: 0, totalItems: 0, perPage: resultsPerPage } })
	}

	if (search) {
		const { wishlist } = await Wishlist.findOne({ user: req.user._id }).select('wishlist').lean()

		const fuse = new Fuse(wishlist, { keys: [ 'title', 'subtype', 'bggId' ], threshold: 0.3, distance: 200 })

		const results = fuse.search(search).map((game) => game.item)

		const pagination = {
			page       : page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		return res.status(200).json({
			collection : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const { wishlist, wishlistCount } = await Wishlist.findOne({ user: req.user._id })
			.select('wishlist')
			.where('wishlist')
			.slice([ resultsPerPage * (page - 1), resultsPerPage ])
			.lean()

		const pagination = {
			page       : page,
			totalPages : Math.ceil(wishlistCount / resultsPerPage),
			totalItems : wishlistCount,
			perPage    : resultsPerPage
		}

		return res.status(200).json({
			collection : wishlist,
			pagination
		})
	}
})

export { updateBggCollection, getOwned, getForTrade, getWantInTrade, getWantToBuy, getWantToPlay, getWishlist }
