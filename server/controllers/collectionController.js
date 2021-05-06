import axios from 'axios'
import asyncHandler from 'express-async-handler'
import { parseXML } from '../helpers/helpers.js'
import Fuse from 'fuse.js'
import Collection from '../models/collectionModel.js'

// @desc    Get owned games from BGG and add to DB
// @route   POST  /api/collections
// @access  Private route
const getCollectionFromBGG = asyncHandler(async (req, res) => {
	const { bggUsername } = req.body

	const collectionExist = await Collection.findOne({ user: req.user._id })

	if (collectionExist) {
		await Collection.deleteMany({ user: req.user._id })
	}

	try {
		const { data } = await axios.get(`https://www.boardgamegeek.com/xmlapi2/collection`, {
			params : {
				username : bggUsername,
				own      : 1
			}
		})

		let { items: { item } } = await parseXML(data)

		let bggCollection = []

		for (let bg of item) {
			const game = {
				user      : req.user._id,
				bggId     : bg.$.objectid,
				title     : bg.originalname ? bg.originalname[0] : bg.name[0]._ || '-',
				year      : bg.yearpublished ? bg.yearpublished[0] : '-',
				thumbnail : bg.thumbnail ? bg.thumbnail[0] : '-'
			}

			bggCollection.push(game)
		}

		await Collection.create(bggCollection)

		res.status(200).json(bggCollection)
	} catch (error) {
		throw {
			status : 'ERROR',
			errors : {
				message : 'Failed to update collection'
			}
		}
	}
})

// @desc    Get owned games from DB
// @route   GET  /api/collections
// @access  Private route
const getCollectionFromDB = asyncHandler(async (req, res) => {
	const queryPage = Number(req.query.page)
	const resultsPerPage = 24
	const querySearchKeyword = req.query.search

	if (querySearchKeyword) {
		const getCollection = await Collection.find({ user: req.user._id }).lean()

		const fuse = new Fuse(getCollection, { keys: [ 'title' ], threshold: 0.3 })

		const results = fuse.search(querySearchKeyword).map((game) => game.item)

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
		const count = await Collection.countDocuments({ user: req.user._id })

		const getCollection = await Collection.find({ user: req.user._id })
			.limit(resultsPerPage)
			.skip(resultsPerPage * (queryPage - 1))
			.lean()

		const pagination = {
			page         : queryPage,
			totalPages   : Math.ceil(count / resultsPerPage),
			totalItems   : count,
			itemsPerPage : resultsPerPage
		}

		if (getCollection.length > 0) {
			res.status(200).json({
				collection : getCollection,
				pagination
			})
		} else {
			throw {
				status : 'ERROR',
				errors : {
					message : 'Collection is empty'
				}
			}
		}
	}
})

export { getCollectionFromBGG, getCollectionFromDB }
