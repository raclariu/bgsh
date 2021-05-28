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

		const collectionExist = await Collection.findOne({ user: req.user._id }).lean()

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

		let { item: owned } = await parseXML(collData)

		let bggCollection = []

		for (let game of owned) {
			const item = {
				bggId     : game.objectid,
				title     : game.originalname ? game.originalname : game.name._ || null,
				year      : game.yearpublished ? +game.yearpublished : null,
				thumbnail : game.thumbnail ? game.thumbnail : null
			}

			bggCollection.push(item)
		}

		// // >> Wishlist
		const { data: wishlistData } = await axios.get('https://www.boardgamegeek.com/xmlapi2/collection', {
			params : {
				username : bggUsername,
				subtype  : 'boardgame',
				own      : 0,
				wishlist : 1
			}
		})

		let { item: wishlist } = await parseXML(wishlistData)

		let bggWishlist = []

		for (let game of wishlist) {
			const item = {
				bggId     : game.objectid,
				title     : game.name ? game.name._ : null,
				year      : game.yearpublished ? +game.yearpublished : null,
				thumbnail : game.thumbnail ? game.thumbnail : null,
				priority  : +game.status.wishlistpriority
			}

			bggWishlist.push(item)
		}

		const created = await Collection.create({
			user          : req.user._id,
			owned         : bggCollection.sort((a, b) => (a.title > b.title ? 1 : -1)),
			wishlist      : bggWishlist,
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

		const pagination = {
			page         : queryPage,
			totalPages   : Math.ceil(totalOwned / resultsPerPage),
			totalItems   : totalOwned,
			itemsPerPage : resultsPerPage
		}

		if (owned.length > 0) {
			res.status(200).json({
				collection : owned,
				pagination
			})
		} else {
			res.status(500)
			throw new Error('Failed to retrieve collection')
		}
	}
})

export { getCollectionFromBGG, getCollectionFromDB }
