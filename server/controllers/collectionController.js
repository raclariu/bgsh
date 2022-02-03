import axios from 'axios'
import asyncHandler from 'express-async-handler'
import Fuse from 'fuse.js'
import Collection from '../models/collectionModel.js'
import Wishlist from '../models/wishlistModel.js'
import { parseXML } from '../helpers/helpers.js'

// * @desc    Get collection from BGG and add to DB
// * @route   POST  /api/collections
// * @access  Private route
const getBggCollectionAndWishlist = asyncHandler(async (req, res) => {
	try {
		const { bggUsername } = req.body

		// @ --------
		// @ Owned---
		// @ --------
		const { data: ownedBoardgamesData } = await axios.get('https://api.geekdo.com/xmlapi2/collection', {
			params : {
				username       : bggUsername,
				subtype        : 'boardgame',
				own            : 1,
				wishlist       : 0,
				version        : 1,
				stats          : 1,
				excludesubtype : 'boardgameexpansion'
			}
		})

		const { data: ownedExpansionsData } = await axios.get('https://api.geekdo.com/xmlapi2/collection', {
			params : {
				username : bggUsername,
				subtype  : 'boardgame',
				own      : 1,
				wishlist : 0,
				version  : 1,
				stats    : 1,
				subtype  : 'boardgameexpansion'
			}
		})

		let parsedOwnedBoardgames = await parseXML(ownedBoardgamesData)
		let parsedOwnedExpansions = await parseXML(ownedExpansionsData)

		// ensure owned boardgames is array if total items is 0,1 or more
		const ensureParsedOwnedBoardgamesIsArray =
			parsedOwnedBoardgames.totalitems === '0'
				? []
				: Array.isArray(parsedOwnedBoardgames.item)
					? parsedOwnedBoardgames.item
					: [ parsedOwnedBoardgames.item ]

		// ensure owned expansions is array if total items is 0,1 or more
		const ensureParsedOwnedExpansionsIsArray =
			parsedOwnedExpansions.totalitems === '0'
				? []
				: Array.isArray(parsedOwnedExpansions.item)
					? parsedOwnedExpansions.item
					: [ parsedOwnedExpansions.item ]

		// combine arrays of boardgames and expansions
		const entireOwnedCollection = ensureParsedOwnedBoardgamesIsArray.concat(ensureParsedOwnedExpansionsIsArray)

		// return res.json(entireOwnedCollection)

		let bggOwned = []
		if (entireOwnedCollection.length > 0) {
			for (let game of entireOwnedCollection) {
				const item = {
					bggId     : game.objectid,
					subtype   : game.subtype === 'boardgame' ? 'boardgame' : 'expansion',
					title     : game.originalname ? game.originalname : game.name._ || null,
					year      : game.yearpublished ? +game.yearpublished : null,
					thumbnail : game.thumbnail ? game.thumbnail : null,
					image     : game.image ? game.image : null,
					added     : game.status.lastmodified,
					stats     : {
						userRating :
							game.stats.rating.value && !isNaN(game.stats.rating.value)
								? +parseFloat(game.stats.rating.value).toFixed(2)
								: null,
						avgRating  : +parseFloat(game.stats.rating.average.value).toFixed(2),
						ratings    : +game.stats.rating.usersrated.value
					},
					version   : !game.version
						? null
						: game.version.item
							? {
									title : Array.isArray(game.version.item.name)
										? game.version.item.name.find((obj) => obj.type === 'primary').value
										: typeof game.version.item.name === 'object' ? game.version.item.name.value : null,

									year  : +game.version.item.yearpublished.value
										? +game.version.item.yearpublished.value
										: null
								}
							: null
				}

				bggOwned.push(item)
			}
		}

		// @ ----------
		// @ Wishlist--
		// @ ----------
		const { data: wishlistBoardgamesData } = await axios.get('https://api.geekdo.com/xmlapi2/collection', {
			params : {
				username       : bggUsername,
				subtype        : 'boardgame',
				own            : 0,
				wishlist       : 1,
				excludesubtype : 'boardgameexpansion'
			}
		})

		const { data: wishlistExpansionsData } = await axios.get('https://api.geekdo.com/xmlapi2/collection', {
			params : {
				username : bggUsername,
				subtype  : 'boardgame',
				own      : 0,
				wishlist : 1,
				subtype  : 'boardgameexpansion'
			}
		})

		let parsedWishlistBoardgames = await parseXML(wishlistBoardgamesData)
		let parsedWishlistExpansions = await parseXML(wishlistExpansionsData)

		// ensure wishlist boardgames is array if total items is 0,1 or more
		const ensureParsedWishlistBoardgamesIsArray =
			parsedWishlistBoardgames.totalitems === '0'
				? []
				: Array.isArray(parsedWishlistBoardgames.item)
					? parsedWishlistBoardgames.item
					: [ parsedWishlistBoardgames.item ]

		// ensure wishlist expansions is array if total items is 0,1 or more
		const ensureParsedWishlistExpansionsIsArray =
			parsedWishlistExpansions.totalitems === '0'
				? []
				: Array.isArray(parsedWishlistExpansions.item)
					? parsedWishlistExpansions.item
					: [ parsedWishlistExpansions.item ]

		// combine arrays of boardgames and expansions
		const entireWishlistCollection = ensureParsedWishlistBoardgamesIsArray.concat(
			ensureParsedWishlistExpansionsIsArray
		)

		let bggWishlist = []
		if (entireWishlistCollection.length > 0) {
			for (let game of entireWishlistCollection) {
				const item = {
					bggId     : game.objectid,
					subtype   : game.subtype === 'boardgame' ? 'boardgame' : 'expansion',
					title     : game.name ? game.name._ : null,
					year      : game.yearpublished ? +game.yearpublished : null,
					thumbnail : game.thumbnail ? game.thumbnail : null,
					image     : game.image ? game.image : null,
					priority  : +game.status.wishlistpriority,
					added     : game.status.lastmodified
				}

				bggWishlist.push(item)
			}
		}

		// Check if collection for this user exists and delete it to add the new one
		const collectionExist = await Collection.findOne({ user: req.user._id }).select('_id').lean()
		if (collectionExist) {
			await Collection.deleteOne({ user: req.user._id })
		}

		// Check if wishlist for this user exists and delete it to add the new one
		const wishlistExist = await Wishlist.findOne({ user: req.user._id }).select('_id').lean()
		if (wishlistExist) {
			await Wishlist.deleteOne({ user: req.user._id })
		}

		await Collection.create({
			user       : req.user._id,
			owned      : bggOwned.length > 0 ? bggOwned.sort((a, b) => (a.title > b.title ? 1 : -1)) : [],
			ownedCount : bggOwned.length
		})

		await Wishlist.create({
			user          : req.user._id,
			wishlist      : bggWishlist.length > 0 ? bggWishlist.sort((a, b) => (a.title > b.title ? 1 : -1)) : [],
			wishlistCount : bggWishlist.length
		})

		return res.status(204).end()
	} catch (error) {
		res.status(500)
		throw {
			message : 'Failed to retrieve collection data from BGG',
			devErr  : error.stack
		}
	}
})

// ~ @desc    Get owned games from DB
// ~ @route   GET  /api/collections/owned
// ~ @access  Private route
const getCollectionFromDB = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const resultsPerPage = 24
	const search = req.query.search

	const findCollection = await Collection.findOne({ user: req.user._id }).select('ownedCount').lean()

	if (!findCollection) {
		res.status(404)
		throw {
			message : 'Collection not found. Add your BGG username in your profile to retrieve your collection'
		}
	}

	if (search) {
		const { owned } = await Collection.findOne({ user: req.user._id }).select('owned').lean()

		const fuse = new Fuse(owned, { keys: [ 'title' ], threshold: 0.3, distance: 200 })

		const results = fuse.search(search).map((game) => game.item)

		const pagination = {
			page       : page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		return res.status(200).json({
			owned      : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const { owned, ownedCount } = await Collection.findOne({ user: req.user._id })
			.select('owned')
			.where('owned')
			.slice([ resultsPerPage * (page - 1), resultsPerPage ])
			.lean()

		const pagination = {
			page         : page,
			totalPages   : Math.ceil(ownedCount / resultsPerPage),
			totalItems   : ownedCount,
			itemsPerPage : resultsPerPage
		}

		return res.status(200).json({
			owned,
			pagination
		})
	}
})

// ~ @desc    Get wishlist from DB
// ~ @route   GET  /api/collections/wishlist
// ~ @access  Private route
const getWishlistFromDB = asyncHandler(async (req, res) => {
	const page = +req.query.page
	const resultsPerPage = 24
	const search = req.query.search

	const findWishlist = await Wishlist.findOne({ user: req.user._id }).select('wishlistCount').lean()

	if (!findWishlist) {
		res.status(404)
		throw {
			message : 'Wishlist not found. Add your BGG username in your profile to retrieve your wishlist'
		}
	}

	if (search) {
		const { wishlist } = await Wishlist.findOne({ user: req.user._id }).select('wishlist').lean()

		const fuse = new Fuse(wishlist, { keys: [ 'title' ], threshold: 0.3, distance: 200 })

		const results = fuse.search(search).map((game) => game.item)

		const pagination = {
			page       : page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		return res.status(200).json({
			wishlist   : results.slice((page - 1) * resultsPerPage, page * resultsPerPage),
			pagination
		})
	} else {
		const { wishlist, wishlistCount } = await Wishlist.findOne({ user: req.user._id })
			.select('wishlist')
			.where('wishlist')
			.slice([ resultsPerPage * (page - 1), resultsPerPage ])
			.lean()

		const pagination = {
			page         : page,
			totalPages   : Math.ceil(wishlistCount / resultsPerPage),
			totalItems   : wishlistCount,
			itemsPerPage : resultsPerPage
		}

		return res.status(200).json({
			wishlist,
			pagination
		})
	}
})

export { getBggCollectionAndWishlist, getCollectionFromDB, getWishlistFromDB }
