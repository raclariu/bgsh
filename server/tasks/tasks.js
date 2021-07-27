import cron from 'node-cron'
import { subDays } from 'date-fns'
import Game from '../models/gameModel.js'

const options = {
	scheduled : false,
	timezone  : 'Europe/Bucharest'
}

const setInactiveTask = cron.schedule(
	'0 3,15 * * *',
	async () => {
		const lookback = subDays(new Date(), 7)

		const games = await Game.updateMany({ updatedAt: { $lte: lookback }, isActive: true }, { isActive: false })
		console.log(`Set ${games.nModified}/${games.n} games to inactive`)
	},
	options
)

export { setInactiveTask }
