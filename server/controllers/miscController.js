import axios from 'axios'
import asyncHandler from 'express-async-handler'
import Kickstarter from '../models/ksModel.js'
import { parseXML } from '../helpers/helpers.js'

// ~ @desc    Get games from BGG by ID
// ~ @route   GET  /api/misc/bgg/games
// ~ @access  Private route
const bggGetGamesDetails = asyncHandler(async (req, res) => {
	try {
		const { bggIds } = req.query

		const { data } = await axios.get('https://api.geekdo.com/xmlapi2/thing', {
			params : {
				id       : bggIds.join(','),
				versions : 1,
				stats    : 1
			}
		})

		let gamesArr = []
		let { item } = await parseXML(data)
		const ensureArray = Array.isArray(item) ? item : [ item ]

		for (let game of ensureArray) {
			const item = {
				type               : game.type === 'boardgame' ? 'boardgame' : 'expansion',
				bggId              : game.id,
				thumbnail          : game.thumbnail || null,
				image              : game.image || null,
				title              : Array.isArray(game.name)
					? game.name.find((obj) => obj.type === 'primary').value
					: game.name.value,
				year               : +game.yearpublished.value || 'N/A',
				description        : game.description || null,
				designers          : game.link
					.filter((link) => link.type === 'boardgamedesigner')
					.map((designer) => designer.value),
				minPlayers         : +game.minplayers.value,
				maxPlayers         : +game.maxplayers.value,
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
				playTime           :
					+game.playingtime.value === 0
						? null
						: game.minplaytime.value === game.maxplaytime.value
							? game.maxplaytime.value
							: `${game.minplaytime.value} - ${game.maxplaytime.value}`,
				minAge             : +game.minage.value === 0 ? null : +game.minage.value,
				categories         : game.link.filter((link) => link.type === 'boardgamecategory').map((ctg) => {
					return { id: +ctg.id, name: ctg.value }
				}),
				mechanics          : game.link.filter((link) => link.type === 'boardgamemechanic').map((mec) => {
					return { id: +mec.id, name: mec.value }
				}),
				versions           : game.versions
					? Array.isArray(game.versions.item)
						? game.versions.item.map((version) => {
								return {
									title : version.name.value,
									year  : +version.yearpublished.value || 'N/A'
								}
							})
						: [ { title: game.versions.item.name.value, year: +game.versions.item.yearpublished.value } ]
					: [ { title: 'No version', year: 'N/A' } ],
				stats              : {
					ratings   : +game.statistics.ratings.usersrated.value,
					avgRating : +parseFloat(game.statistics.ratings.average.value).toFixed(2),
					rank      :
						game.type === 'boardgame'
							? Array.isArray(game.statistics.ratings.ranks.rank)
								? +game.statistics.ratings.ranks.rank.find((obj) => +obj.id === 1).value
								: null
							: null
				},
				complexity         : {
					weight :
						+game.statistics.ratings.numweights.value > 0
							? +parseFloat(game.statistics.ratings.averageweight.value).toFixed(2)
							: null,
					votes  : +game.statistics.ratings.numweights.value
				},
				parent             :
					game.type === 'boardgameexpansion'
						? game.link.filter((link) => link.inbound && link.inbound === 'true').map((parent) => {
								return { bggId: parent.id, title: parent.value }
							})
						: [],
				expansions         :
					game.type === 'boardgame'
						? game.link.filter((link) => link.type === 'boardgameexpansion').map((exp) => {
								return { bggId: exp.id, title: exp.value }
							})
						: []
			}

			gamesArr.push(item)
		}

		return res.status(200).json(gamesArr)
	} catch (error) {
		res.status(503)
		throw {
			message : 'Failed to retrieve data from BGG',
			devErr  : error.stack
		}
	}
})

// ~ @desc    Get BGG hot games
// ~ @route   GET /api/misc/bgg/hot
// ~ @access  Public route
const bggGetHotGamesList = asyncHandler(async (req, res) => {
	try {
		const { data } = await axios.get('https://api.geekdo.com/xmlapi2/hot', {
			params : {
				type : 'boardgame'
			}
		})

		const hotArr = []
		let { item } = await parseXML(data)
		const ensureArray = Array.isArray(item) ? item : [ item ]

		for (let game of ensureArray) {
			const hotGame = {
				bggId     : game.id || null,
				// rank      : game.rank ? +game.rank : null,
				thumbnail : game.thumbnail ? game.thumbnail.value : null,
				title     : game.name ? game.name.value : '',
				year      : game.yearpublished ? +game.yearpublished.value : null
			}

			hotArr.push(hotGame)
		}

		return res.status(200).json(hotArr)
	} catch (error) {
		res.status(400)
		throw {
			message : 'Failed to retrieve data from BGG',
			devErr  : error.stack
		}
	}
})

// ~ @desc Get gallery of images for single game from BGG
// ~ @route  GET /api/misc/bgg/gallery
// ~ @access Private route
const bggGetGallery = asyncHandler(async (req, res) => {
	try {
		const { bggIds } = req.query

		let images = []

		for (let id of bggIds) {
			const { data } = await axios.get('https://api.geekdo.com/api/images', {
				params : {
					ajax          : 1,
					date          : 'alltime',
					gallery       : 'all',
					nosession     : 1,
					objectid      : id,
					objecttype    : 'thing',
					pageid        : 1,
					showcount     : 12,
					size          : 'thumb',
					sort          : 'hot',
					licensefilter : 'reuse'
					//tag        : 'Play,Components'
				}
			})

			const mapImages = data.images.map((img) => {
				const {
					imageid,
					imageurl_lg : image,
					caption,
					imageurl    : thumbnail,
					href        : extLink,
					user        : { username: postedBy }
				} = img
				return { imageid, image, caption: caption || 'No caption available', thumbnail, extLink, postedBy }
			})
			images.push(mapImages)
		}

		return res.status(200).json(images)
	} catch (error) {
		res.status(503)
		throw {
			message : 'Failed to retrieve images from BGG',
			devErr  : error.stack
		}
	}
})

// ~ @desc    Search BGG for games
// ~ @route   GET  /api/misc/bgg/search
// ~ @access  Private route
const bggSearchGame = asyncHandler(async (req, res) => {
	try {
		const { search } = req.query

		const { data } = await axios.get('https://api.geekdo.com/xmlapi2/search', {
			params : {
				query : search.split(' ').join('+'),
				type  : 'boardgame,boardgameexpansion'
			}
		})

		let parsedSearch = await parseXML(data)

		if (parsedSearch.total === '0') {
			return res.status(200).json([])
		}

		const ensureArray = Array.isArray(parsedSearch.item) ? parsedSearch.item : [ parsedSearch.item ]

		const gamesArr = []
		for (let game of ensureArray) {
			const item = {
				bggId     : game.id,
				title     : game.name.value,
				year      : game.yearpublished ? +game.yearpublished.value : 'N/A',
				thumbnail : null,
				image     : null
			}
			gamesArr.push(item)
		}

		return res.status(200).json(gamesArr)
	} catch (error) {
		res.status(503)
		throw {
			message : 'Failed to retrieve data from BGG',
			devErr  : error.stack
		}
	}
})

// ~ @desc    Get BGG "fans also like"
// ~ @route   GET  /api/misc/bgg/reccomendations
// ~ @access  Public route
const getBggReccomendations = asyncHandler(async (req, res) => {
	try {
		const { bggId } = req.query

		const { data } = await axios.get('https://api.geekdo.com/api/geekitem/recs', {
			params : {
				ajax       : 1,
				objectid   : bggId,
				objecttype : 'thing',
				pageid     : 1
			}
		})

		const recArr = []
		for (let rec of data.recs) {
			const { item, image, rating, rank, yearpublished: year } = rec
			const { id: bggId, name: title } = item
			const { src: thumbnail } = image
			recArr.push({
				bggId,
				title,
				thumbnail,
				stats     : { avgRating: +parseFloat(rating).toFixed(2), rank },
				year      : +year
			})
		}

		res.status(200).json(recArr)
	} catch (error) {
		res.status(503)
		throw {
			message : 'Failed to retrieve data from BGG',
			devErr  : error.stack
		}
	}
})

// ~ @desc    Get all kickstarters
// ~ @route   GET  /api/misc/kickstarters
// ~ @access  Public route
const getKickstarters = asyncHandler(async (req, res) => {
	const kickstarters = await Kickstarter.find({})

	if (kickstarters.length === 0) {
		res.status(404)
		throw {
			message : 'No kickstarters found'
		}
	}

	res.status(200).json(kickstarters)
})

export { bggGetGamesDetails, bggGetHotGamesList, bggGetGallery, bggSearchGame, getKickstarters, getBggReccomendations }
