import cron from 'node-cron'
import chalk from 'chalk'
import { subDays } from 'date-fns'
import Game from '../models/gameModel.js'
import Notification from '../models/notificationModel.js'

const options = {
	scheduled : false,
	timezone  : 'Europe/Bucharest'
}

const dailyTask = cron.schedule(
	//'0 3,15 * * *',
	'0 8,18 * * *',
	// '*/10 * * * * *',
	async () => {
		const lookback = subDays(new Date(), 7)
		const gamesToExpire = await Game.find({ isActive: true, reactivatedAt: { $lte: lookback } }).lean()

		let notifArr = []
		for (let obj of gamesToExpire) {
			const text = obj.isPack
				? `Your pack containing ${obj.games
						.map((game) => game.title)
						.join(', ')} has expired. Head to your listed games to reactivate it`
				: `Your ${obj.games[0].title} listing has expired. Head to your listed games to reactivate it`
			notifArr.push({
				recipient : obj.addedBy,
				type      : 'expired',
				text,
				meta      : {
					thumbnail : obj.games[0].thumbnail
				}
			})
		}

		await Notification.insertMany(notifArr)
		notifArr = []

		const modify = await Game.updateMany({ isActive: true, reactivatedAt: { $lte: lookback } }, { isActive: false })

		// Clear notifications older than 14 days
		const ntfLookback = subDays(new Date(), 14)
		const deletedNtfCount = await Notification.deleteMany({ createdAt: { $lte: ntfLookback } }).lean()

		console.log(chalk.hex('#737373')('_____________________________________________'))
		console.log(
			chalk
				.bgHex('#8c4f00')
				.hex('#f7edcb')
				.bold(
					'\n' +
						`Ran daily task at ${new Date().toLocaleString('ro-RO')}` +
						'\n' +
						`>> updated ${modify.modifiedCount}/${modify.matchedCount} games to inactive` +
						'\n' +
						`>> deleted ${deletedNtfCount.deletedCount} notifications older than 14 days` +
						'\n'
				)
		)
		console.log(chalk.hex('#737373')('_____________________________________________'))
	},
	options
)

export { dailyTask }
