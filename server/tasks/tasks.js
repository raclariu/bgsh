import cron from 'node-cron'
import puppeteer from 'puppeteer'
import { subDays } from 'date-fns'
import Game from '../models/gameModel.js'
import Kickstarter from '../models/ksModel.js'
import Notification from '../models/notificationModel.js'

const options = {
	scheduled : false,
	timezone  : 'Europe/Bucharest'
}

const setInactiveTask = cron.schedule(
	//'0 3,15 * * *',
	'0 8,18 * * *',
	// '*/10 * * * * *',
	async () => {
		const lookback = subDays(new Date(), 7)
		const gamesToExpire = await Game.find({ isActive: true, updatedAt: { $lte: lookback } }).lean()

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
					altId     : obj.altId,
					thumbnail : obj.games[0].thumbnail
				}
			})
		}

		await Notification.insertMany(notifArr)
		notifArr = []

		const modify = await Game.updateMany({ isActive: true, updatedAt: { $lte: lookback } }, { isActive: false })
		console.log(`ran inactive task at ${new Date()} - modified ${modify.modifiedCount}/${modify.matchedCount}`)
		// await Game.updateMany({ updatedAt: { $lte: lookback }, isActive: false }, { isActive: true })
	},
	options
)

const getKickstarters = cron.schedule(
	'*/10 * * * * *',
	async () => {
		const browser = await puppeteer.launch() //{ headless: false }
		const page = await browser.newPage()
		await page.goto('https://www.kickstarter.com/discover/advanced?state=live&category_id=34&sort=popularity')

		await page.waitForSelector('#projects_list')

		const data = await page.evaluate(() => {
			let kickstartersRaw = []

			let documents = [ ...document.querySelectorAll('[data-pid]') ]
			console.log(documents)

			for (let ks of documents) {
				kickstartersRaw.push(JSON.parse(ks.dataset.project))
			}

			const kickstarters = kickstartersRaw.map((ks) => {
				return {
					ksId             : ks.id,
					title            : ks.name,
					shortDescription : ks.blurb,
					backers          : ks.backers_count,
					currencySymbol   : ks.currency_symbol,
					pledged          : ks.pledged,
					goal             : ks.goal,
					percentFunded    : ks.percent_funded,
					url              : ks.urls.web.project,
					creator          : ks.creator.name,
					country          : ks.country,
					launched         : ks.launched_at,
					deadline         : ks.deadline,
					image            : ks.photo.ed
				}
			})

			return kickstarters
		})

		await browser.close()

		await Kickstarter.deleteMany({})
		await Kickstarter.insertMany(data)
	},
	options
)

export { setInactiveTask, getKickstarters }
