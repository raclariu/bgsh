import axios from 'axios'
import asyncHandler from 'express-async-handler'
import Fuse from 'fuse.js'
import Collection from '../models/collectionModel.js'
import Wishlist from '../models/WishlistModel.js'
import { parseXML } from '../helpers/helpers.js'

// * @desc    Get collection from BGG and add to DB
// * @route   POST  /api/collections
// * @access  Private route
const getBggCollectionAndWishlist = asyncHandler(async (req, res) => {
	try {
		const { bggUsername } = req.body

		// >> Owned
		const { data: ownedData } = await axios.get('https://api.geekdo.com/xmlapi2/collection', {
			params : {
				username : bggUsername,
				subtype  : 'boardgame',
				own      : 1,
				wishlist : 0
			}
		})

		// If there is only one game in collection, parser returns object instead of array, that's why the if/else is needed
		let parsedOwned = await parseXML(ownedData)

		let bggOwned = []
		if (parsedOwned.totalitems !== '0') {
			if (Array.isArray(parsedOwned.item)) {
				for (let game of parsedOwned.item) {
					const item = {
						bggId     : game.objectid,
						title     : game.originalname ? game.originalname : game.name._ || null,
						year      : game.yearpublished ? +game.yearpublished : null,
						thumbnail : game.thumbnail ? game.thumbnail : null,
						image     : game.image ? game.image : null,
						added     : game.status.lastmodified
					}

					bggOwned.push(item)
				}
			} else {
				const {
					objectid,
					name,
					originalname,
					yearpublished,
					thumbnail,
					image,
					status        : { lastmodified }
				} = parsedOwned.item
				const item = {
					bggId     : objectid,
					title     : originalname ? originalname : name._ || null,
					year      : yearpublished ? +yearpublished : null,
					thumbnail : thumbnail ? thumbnail : null,
					image     : image ? image : null,
					added     : lastmodified
				}

				bggOwned.push(item)
			}
		}

		// @ Wishlist
		const { data: wishlistData } = await axios.get('https://api.geekdo.com/xmlapi2/collection', {
			params : {
				username : bggUsername,
				subtype  : 'boardgame',
				own      : 0,
				wishlist : 1
			}
		})

		// If there is only one game in wishlist, parser returns object instead of array, that's why the if/else is needed
		let parsedWishlist = await parseXML(wishlistData)

		let bggWishlist = []
		if (parsedWishlist.totalitems !== '0') {
			if (parsedWishlist.totalitems !== '1') {
				for (let game of parsedWishlist.item) {
					const item = {
						bggId     : game.objectid,
						title     : game.name ? game.name._ : null,
						year      : game.yearpublished ? +game.yearpublished : null,
						thumbnail : game.thumbnail ? game.thumbnail : null,
						image     : game.image ? game.image : null,
						priority  : +game.status.wishlistpriority,
						added     : game.status.lastmodified
					}

					bggWishlist.push(item)
				}
			} else {
				const {
					objectid,
					name,
					yearpublished,
					thumbnail,
					image,
					status        : { lastmodified, wishlistpriority }
				} = parsedWishlist.item
				const item = {
					bggId     : objectid,
					title     : name ? name._ : null,
					year      : yearpublished ? +yearpublished : null,
					thumbnail : thumbnail ? thumbnail : null,
					image     : image ? image : null,
					priority  : +wishlistpriority,
					added     : lastmodified
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

		console.log(bggOwned)

		await Collection.create({
			user       : req.user._id,
			owned      : bggOwned.length > 0 ? bggOwned.sort((a, b) => (a.title > b.title ? 1 : -1)) : [],
			ownedCount : bggOwned.length
		})

		await Wishlist.create({
			user          : req.user._id,
			wishlist      : bggWishlist.length > 0 ? bggWishlist.sort((a, b) => b.priority - a.priority) : [],
			wishlistCount : bggWishlist.length
		})

		res.status(204).end()
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

	// if (findCollection.ownedCount === 0) {
	// 	res.status(404)
	// 	throw {
	// 		message : 'Collection is empty'
	// 	}
	// }

	if (search) {
		const { owned } = await Collection.findOne({ user: req.user._id }).select('owned').lean()

		const fuse = new Fuse(owned, { keys: [ 'title' ], threshold: 0.3, distance: 200 })

		const results = fuse.search(search).map((game) => game.item)

		// if (results.length === 0) {
		// 	res.status(404)
		// 	throw {
		// 		message : 'No results found'
		// 	}
		// }

		const pagination = {
			page       : page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		// if (pagination.totalPages < page) {
		// 	res.status(404)
		// 	throw {
		// 		message : 'No games found'
		// 	}
		// }

		res.status(200).json({
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

		// if (pagination.totalPages < page) {
		// 	res.status(404)
		// 	throw {
		// 		message : 'No games found'
		// 	}
		// }

		res.status(200).json({
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

	// if (findWishlist.wishlistCount === 0) {
	// 	res.status(404)
	// 	throw {
	// 		message : 'Wishlist is empty'
	// 	}
	// }

	if (search) {
		const { wishlist } = await Wishlist.findOne({ user: req.user._id }).select('wishlist').lean()

		const fuse = new Fuse(wishlist, { keys: [ 'title' ], threshold: 0.3, distance: 200 })

		const results = fuse.search(search).map((game) => game.item)

		// if (results.length === 0) {
		// 	res.status(404)
		// 	throw {
		// 		message : 'No results found'
		// 	}
		// }

		const pagination = {
			page       : page,
			totalPages : Math.ceil(results.length / resultsPerPage),
			totalItems : results.length,
			perPage    : resultsPerPage
		}

		// if (pagination.totalPages < page) {
		// 	res.status(404)
		// 	throw {
		// 		message : 'No games found'
		// 	}
		// }

		res.status(200).json({
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

		// if (pagination.totalPages < page) {
		// 	res.status(404)
		// 	throw {
		// 		message : 'No games found'
		// 	}
		// }

		res.status(200).json({
			wishlist,
			pagination
		})
	}
})

export { getBggCollectionAndWishlist, getCollectionFromDB, getWishlistFromDB }
