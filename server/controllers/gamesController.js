import axios from 'axios'
import asyncHandler from 'express-async-handler'
import { parseXML } from '../helpers/helpers.js'

// ~ @desc    Get single game from BGG
// ~ @route   GET  /api/games/:bggId
// ~ @access  Private route
const getOneGameFromBGG = asyncHandler(async (req, res) => {
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
		let game = item[0]

		res.status(200).json({
			type               : game.$.type,
			bggId,
			thumbnail          : game.thumbnail[0],
			image              : game.image[0],
			title              : game.name[0].$.value,
			year               : +game.yearpublished[0].$.value,
			minPlayers         : +game.minplayers[0].$.value,
			maxPlayers         : +game.maxplayers[0].$.value,
			suggestedPlayers   : +game.poll[0].results.sort(
				(a, b) => +b.result[0].$.numvotes - +a.result[0].$.numvotes
			)[0].$.numplayers,
			playingTime        : +game.playingtime[0].$.value,
			languageDependence : game.poll[2].results[0].result.sort((a, b) => +b.$.numvotes - +a.$.numvotes)[0].$
				.value,
			categories         : game.link
				.filter((ctg) => ctg.$.type === 'boardgamecategory')
				.map((ctg) => ctg.$.value),
			mechanics          : game.link
				.filter((mec) => mec.$.type === 'boardgamemechanic')
				.map((mec) => mec.$.value),
			versions           : game.versions[0].item.map((v) => {
				return {
					title : v.name[0].$.value,
					year  : +v.yearpublished[0].$.value
				}
			}),
			stats              : {
				numRatings : +game.statistics[0].ratings[0].usersrated[0].$.value,
				avgRating  : +parseFloat(game.statistics[0].ratings[0].average[0].$.value).toFixed(2),
				rank       : +game.statistics[0].ratings[0].ranks[0].rank[0].$.value
			}
		})
	} catch (error) {
		res.status(503)
		throw {
			message : 'Failed to retrieve data from BGG',
			devErr  : error.stack
		}
	}
})

export { getOneGameFromBGG }
