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
		const { data } = await axios.get('https://www.boardgamegeek.com/xmlapi2/collection', {
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

// @desc    Get single game from BGG
// @route   GET  /api/collections/:bggId
// @access  Private route
const getBoardgameFromBGG = asyncHandler(async (req, res) => {
	const { bggId } = req.params

	try {
		const { data } = await axios.get('https://www.boardgamegeek.com/xmlapi2/thing', {
			params : {
				id       : bggId,
				versions : 1,
				stats    : 1
			}
		})

		let { items: { item } } = await parseXML(data)
		let bg = item[0]

		res.status(200).json({
			type               : bg.$.type,
			bggId,
			thumbnail          : bg.thumbnail[0],
			image              : bg.image[0],
			title              : bg.name[0].$.value,
			year               : bg.yearpublished[0].$.value,
			minPlayers         : +bg.minplayers[0].$.value,
			maxPlayers         : +bg.maxplayers[0].$.value,
			suggestedPlayers   : Number(
				bg.poll[0].results.sort((a, b) => +b.result[0].$.numvotes - +a.result[0].$.numvotes)[0].$.numplayers
			),
			languageDependence : bg.poll[2].results[0].result.sort((a, b) => +b.$.numvotes - +a.$.numvotes)[0].$.value,
			playingTime        : +bg.playingtime[0].$.value,
			categories         : bg.link.filter((ctg) => ctg.$.type === 'boardgamecategory').map((ctg) => ctg.$.value),
			mechanics          : bg.link.filter((mec) => mec.$.type === 'boardgamemechanic').map((mec) => mec.$.value),
			versions           : bg.versions[0].item.map((v) => {
				return {
					title : v.name[0].$.value,
					year  : v.yearpublished[0].$.value
				}
			}),
			stats              : {
				numRatings : +bg.statistics[0].ratings[0].usersrated[0].$.value,
				avgRating  : +parseFloat(bg.statistics[0].ratings[0].average[0].$.value).toFixed(2),
				rank       : +bg.statistics[0].ratings[0].ranks[0].rank[0].$.value
			}
		})
	} catch (error) {
		throw {
			status : 'ERROR',
			errors : {
				message : 'Failed to update collection'
			}
		}
	}
})

export { getCollectionFromBGG, getCollectionFromDB, getBoardgameFromBGG }
