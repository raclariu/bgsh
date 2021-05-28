import axios from 'axios'
import asyncHandler from 'express-async-handler'
import { parseXML } from '../helpers/helpers.js'
import Fuse from 'fuse.js'
import Collection from '../models/collectionModel.js'

// * @desc    Get collection from BGG and add to DB
// * @route   POST  /api/collections
// * @access  Private route
const getCollectionFromBGG = asyncHandler(async (req, res) => {
	try {
		const { bggUsername } = req.body

		const collectionExist = await Collection.findOne({ user: req.user._id }).select('_id').lean()

		if (collectionExist) {
			await Collection.deleteOne({ user: req.user._id })
		}

		// >> Owned
		const { data: collData } = await axios.get('https://www.boardgamegeek.com/xmlapi2/collection', {
			params : {
				username : bggUsername,
				subtype  : 'boardgame',
				own      : 1
			}
		})

		let parsedOwned = await parseXML(collData)

		let bggCollection = []

		if (parsedOwned.totalitems !== '0') {
			for (let game of parsedOwned.item) {
				const item = {
					bggId     : game.objectid,
					title     : game.originalname ? game.originalname : game.name._ || null,
					year      : game.yearpublished ? +game.yearpublished : null,
					thumbnail : game.thumbnail ? game.thumbnail : null
				}

				bggCollection.push(item)
			}
		}

		// >> Wishlist
		const { data: wishlistData } = await axios.get('https://www.boardgamegeek.com/xmlapi2/collection', {
			params : {
				username : bggUsername,
				subtype  : 'boardgame',
				own      : 0,
				wishlist : 1
			}
		})

		let parsedWishlist = await parseXML(wishlistData)

		let bggWishlist = []

		if (parsedWishlist.totalitems !== '0') {
			for (let game of parsedWishlist.item) {
				const item = {
					bggId     : game.objectid,
					title     : game.name ? game.name._ : null,
					year      : game.yearpublished ? +game.yearpublished : null,
					thumbnail : game.thumbnail ? game.thumbnail : null,
					priority  : +game.status.wishlistpriority
				}

				bggWishlist.push(item)
			}
		}

		const created = await Collection.create({
			user          : req.user._id,
			owned         : bggCollection.length > 0 ? bggCollection.sort((a, b) => (a.title > b.title ? 1 : -1)) : [],
			wishlist      : bggWishlist.length > 0 ? bggWishlist.sort((a, b) => b.priority - a.priority) : [],
			totalOwned    : bggCollection.length,
			totalWishlist : bggWishlist.length
		})

		res.status(200).json(created)
	} catch (error) {
		res.status(500)
		throw {
			message : 'Failed to retrieve collection data from BGG',
			devErr  : error.stack
		}
	}
})

// ~ @desc    Get collection from DB
// ~ @route   GET  /api/collections
// ~ @access  Private route
const getCollectionFromDB = asyncHandler(async (req, res) => {
	const queryPage = Number(req.query.page)
	const resultsPerPage = 24
	const searchKeyword = req.query.search

	if (searchKeyword) {
		const { owned } = await Collection.findOne({ user: req.user._id }).select('owned').lean()

		const fuse = new Fuse(owned, { keys: [ 'title' ], threshold: 0.3 })

		const results = fuse.search(searchKeyword).map((game) => game.item)

		const pagination = {
			page       : queryPage,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		res.status(200).json({
			collection : results.slice((queryPage - 1) * resultsPerPage, queryPage * resultsPerPage),
			pagination
		})
	} else {
		const { owned, totalOwned } = await Collection.findOne({ user: req.user._id })
			.select('-wishlist')
			.where('owned')
			.slice([ resultsPerPage * (queryPage - 1), resultsPerPage ])
			.lean()

		if (totalOwned === 0) {
			res.status(404)
			throw {
				message : 'Collection is empty'
			}
		}

		// >> Owned.length means current page > total pages
		if (owned.length === 0) {
			res.status(404)
			throw {
				message : 'Page not found'
			}
		} else {
			const pagination = {
				page         : queryPage,
				totalPages   : Math.ceil(totalOwned / resultsPerPage),
				totalItems   : totalOwned,
				itemsPerPage : resultsPerPage
			}

			res.status(200).json({
				collection : owned,
				pagination
			})
		}
	}
})

// ~ @desc    Get wishlist from DB
// ~ @route   GET  /api/collections/wishlist
// ~ @access  Private route
const getWishlistFromDB = asyncHandler(async (req, res) => {
	const { wishlist, totalWishlist } = await Collection.findOne({ user: req.user._id }).select('-owned').lean()

	if (totalWishlist === 0) {
		res.status(404)
		throw {
			message : 'Wishlist is empty'
		}
	} else {
		res.status(200).json(wishlist)
	}
})

export { getCollectionFromBGG, getCollectionFromDB, getWishlistFromDB }
