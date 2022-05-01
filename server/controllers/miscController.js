import axios from 'axios'
import { validationResult } from 'express-validator'
import asyncHandler from 'express-async-handler'
import Report from '../models/reportModel.js'
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
				subtype            : game.type === 'boardgame' ? 'boardgame' : 'expansion',
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
								: +[ game.statistics.ratings.ranks.rank ].find((obj) => +obj.id === 1).value
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
							})[0]
						: null,
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
// ~ @access  Private route
const bggGetHotGamesList = asyncHandler(async (req, res) => {
	try {
		const { data } = await axios.get('https://api.geekdo.com/xmlapi2/hot', {
			params : {
				type : 'boardgame'
			}
		})

		let { item: simpleHotArr } = await parseXML(data)
		const ensureSimpleHotArray = Array.isArray(simpleHotArr) ? simpleHotArr : [ simpleHotArr ]

		const { data: fullData } = await axios.get('https://api.geekdo.com/xmlapi2/thing', {
			params : {
				id    : ensureSimpleHotArray.map((game) => game.id).join(','),
				stats : 1
			}
		})

		let { item } = await parseXML(fullData)
		const ensureArray = Array.isArray(item) ? item : [ item ]

		const hotGamesArr = []
		for (let game of ensureArray) {
			const item = {
				subtype    : game.type === 'boardgame' ? 'boardgame' : 'expansion',
				bggId      : game.id,
				thumbnail  : game.thumbnail || null,
				image      : game.image || null,
				title      : Array.isArray(game.name)
					? game.name.find((obj) => obj.type === 'primary').value
					: game.name.value,
				year       : +game.yearpublished.value || 'N/A',

				stats      : {
					ratings   : +game.statistics.ratings.usersrated.value,
					avgRating : +parseFloat(game.statistics.ratings.average.value).toFixed(2),
					rank      :
						game.type === 'boardgame'
							? Array.isArray(game.statistics.ratings.ranks.rank)
								? +game.statistics.ratings.ranks.rank.find((obj) => +obj.id === 1).value
								: +[ game.statistics.ratings.ranks.rank ].find((obj) => +obj.id === 1).value
							: null
				},
				complexity : {
					weight :
						+game.statistics.ratings.numweights.value > 0
							? +parseFloat(game.statistics.ratings.averageweight.value).toFixed(2)
							: null,
					votes  : +game.statistics.ratings.numweights.value
				}
			}

			hotGamesArr.push(item)
		}

		return res.status(200).json(hotGamesArr)
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
		const { bggId } = req.query

		const { data } = await axios.get('https://api.geekdo.com/api/images', {
			params : {
				ajax       : 1,
				date       : 'alltime',
				gallery    : 'game',
				nosession  : 1,
				objectid   : bggId,
				objecttype : 'thing',
				pageid     : 1,
				showcount  : 12,
				size       : 'thumb',
				sort       : 'hot'
				// licensefilter : 'reuse'
				// tag        : 'Components' // Play
			}
		})

		if (data.images.length === 0) {
			return res.status(200).json([])
		}

		const images = data.images.map((img) => {
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
// ~ @access  Private route
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

		return res.status(200).json(recArr.slice(0, 24))
	} catch (error) {
		res.status(503)
		throw {
			message : 'Failed to retrieve data from BGG',
			devErr  : error.stack
		}
	}
})

// ~ @desc    Get BGG videos
// ~ @route   GET  /api/misc/bgg/videos
// ~ @access  Private route
const getBggVideos = asyncHandler(async (req, res) => {
	try {
		const { bggId } = req.query

		const { data } = await axios.get('https://api.geekdo.com/api/videos', {
			params : {
				ajax       : 1,
				gallery    : 'all',
				languageid : 2184,
				nosession  : 1,
				objectid   : bggId,
				objecttype : 'thing',
				pageid     : 1,
				showcount  : 4,
				sort       : 'hot'
			}
		})

		const vidsArr = []
		if (data.videos.length > 0) {
			for (let vid of data.videos) {
				const {
					extvideoid : ytId,
					href       : extLink,
					title,
					images     : { square: thumbnail },
					user       : { username: user },
					gallery    : type
				} = vid

				vidsArr.push({
					ytId,
					extLink,
					title,
					thumbnail,
					user,
					type
				})
			}
		}

		return res.status(200).json(vidsArr)
	} catch (error) {
		res.status(503)
		throw {
			message : 'Failed to retrieve data from BGG',
			devErr  : error.stack
		}
	}
})

// ~ @desc    Get BGG new releases
// ~ @route   GET  /api/misc/releases
// ~ @access  Private route
const getBggNewReleases = asyncHandler(async (req, res) => {
	try {
		const { data } = await axios.get('https://api.geekdo.com/api/newreleases')

		const newRelArr = []
		if (data.length > 0) {
			for (let obj of data) {
				const newRelease = {
					bggId       : obj.item.id,
					title       : obj.itemName,
					publisher   : obj.publisherName,
					description : obj.description,
					thumbnail   : obj.image.src
				}

				newRelArr.push(newRelease)
			}
		}

		return res.status(200).json(newRelArr)
	} catch (error) {
		res.status(503)
		throw {
			message : 'Failed to retrieve data from BGG',
			devErr  : error.stack
		}
	}
})

// ~ @desc    Get ending crowdfunding campaigns
// ~ @route   GET  /api/misc/crowdfunding
// ~ @access  Private route
const getBggCrowdfundingCampaigns = asyncHandler(async (req, res) => {
	try {
		const { data } = await axios.get('https://api.geekdo.com/api/ending_preorders')

		const campaigns = []
		if (data.length > 0) {
			for (let obj of data) {
				if (!obj.featured) {
					const campaign = {
						bggId    : obj.item.id,
						deadline : obj.endDate,
						title    : obj.name,
						progress : obj.progress,
						currency : obj.currency,
						pledged  : obj.pledged,
						backers  : obj.backersCount,
						image    : obj.images.mediacard.src,
						url      : obj.orderUrl,
						from     : obj.orderType
					}

					campaigns.push(campaign)
				}
			}
		}

		return res.status(200).json(campaigns)
	} catch (error) {
		res.status(503)
		throw {
			message : 'Failed to retrieve data from BGG',
			devErr  : error.stack
		}
	}
})

// * @desc    Submit report
// * @route   POST  /api/misc/report
// * @access  Private route
const submitReport = asyncHandler(async (req, res) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		const err = validationErrors.mapped()

		res.status(400)
		throw {
			message : {
				type       : err.type ? err.type.msg : null,
				reportText : err.reportText ? err.reportText.msg : null,
				username   : err.username ? err.username.msg : null,
				altId      : err.altId ? err.altId.msg : null
			}
		}
	}

	const { type, username, altId, reportText } = req.body

	await Report.create({
		type,
		reportedUser      : type === 'user' ? username : null,
		reportedGameAltId : type === 'game' ? altId : null,
		reportText
	})

	return res.status(204).end()
})

export {
	bggGetGamesDetails,
	bggGetHotGamesList,
	bggGetGallery,
	bggSearchGame,
	getBggReccomendations,
	getBggVideos,
	submitReport,
	getBggNewReleases,
	getBggCrowdfundingCampaigns
}
