import axios from 'axios'
import asyncHandler from 'express-async-handler'
import { parseXML } from '../helpers/helpers.js'

// * @desc    Get single game from BGG
// * @route   POST  /api/games/bgg
// * @access  Private route
const getOneGameFromBGG = asyncHandler(async (req, res) => {
	try {
		const { bggIds } = req.body

		let gamesArr = []

		for (let id of bggIds) {
			const { data } = await axios.get('https://www.boardgamegeek.com/xmlapi2/thing', {
				params : {
					id,
					versions : 1,
					stats    : 1
				}
			})

			let { item: game } = await parseXML(data)

			gamesArr.push({
				type               : game.type,
				bggId              : game.id,
				thumbnail          : game.thumbnail || null,
				image              : game.image || null,
				title              : Array.isArray(game.name)
					? game.name.find((obj) => obj.type === 'primary').value
					: game.name.value,
				year               : +game.yearpublished.value,
				designers          : game.link
					.filter((link) => link.type === 'boardgamedesigner')
					.map((designer) => designer.value),
				minPlayers         : +game.minplayers.value,
				maxPlayers         : +game.maxplayers.value,
				suggestedPlayers   :
					+game.poll.find((obj) => obj.name === 'suggested_numplayers').totalvotes !== 0
						? +game.poll
								.find((obj) => obj.name === 'suggested_numplayers')
								.results.sort(
									(a, b) =>
										+b.result.find((obj) => obj.value === 'Best').numvotes -
										+a.result.find((obj) => obj.value === 'Best').numvotes
								)[0].numplayers
						: null,
				languageDependence : game.poll
					? +game.poll.find((obj) => obj.name === 'language_dependence').totalvotes > 0
						? game.poll
								.find((obj) => obj.name === 'language_dependence')
								.results.result.sort((a, b) => +b.numvotes - +a.numvotes)[0].value
						: 'Not enough votes'
					: null,
				playTime           :
					+game.playingtime.value === 0 ? null : `${game.minplaytime.value}-${game.maxplaytime.value}`,
				minAge             : +game.minage.value === 0 ? null : +game.minage.value,
				categories         : game.link.filter((link) => link.type === 'boardgamecategory').map((ctg) => {
					return { id: +ctg.id, name: ctg.value }
				}),
				mechanics          : game.link.filter((link) => link.type === 'boardgamemechanic').map((mec) => {
					return { id: +mec.id, name: mec.value }
				}),
				versions           : Array.isArray(game.versions.item)
					? game.versions.item.map((v) => {
							return {
								title : v.name.value,
								year  : +v.yearpublished.value
							}
						})
					: [ { title: game.versions.item.name.value, year: +game.versions.item.yearpublished.value } ],
				stats              : {
					ratings   : +game.statistics.ratings.usersrated.value,
					avgRating : +parseFloat(game.statistics.ratings.average.value).toFixed(2),
					rank      : Array.isArray(game.statistics.ratings.ranks.rank)
						? +game.statistics.ratings.ranks.rank.find((obj) => +obj.id === 1).value
						: 'Not ranked'
				},
				complexity         : {
					weight : +parseFloat(game.statistics.ratings.averageweight.value).toFixed(2),
					votes  : +game.statistics.ratings.numweights.value
				}
			})
		}

		res.status(200).json(gamesArr)
	} catch (error) {
		res.status(503)
		throw {
			message : 'Failed to retrieve data from BGG',
			devErr  : error.stack
		}
	}
})

export { getOneGameFromBGG }
