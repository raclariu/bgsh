import cron from 'node-cron'
import puppeteer from 'puppeteer'
import { subDays } from 'date-fns'
import Game from '../models/gameModel.js'
import Kickstarter from '../models/ksModel.js'

const options = {
	scheduled : false,
	timezone  : 'Europe/Bucharest'
}

const setInactiveTask = cron.schedule(
	// */10 * * * * *
	'0 3,15 * * *',
	async () => {
		const lookback = subDays(new Date(), 7)

		await Game.updateMany({ updatedAt: { $lte: lookback }, isActive: true }, { isActive: false })
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
