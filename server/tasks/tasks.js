import cron from 'node-cron'
import puppeteer from 'puppeteer'
import { subDays } from 'date-fns'
import Game from '../models/gameModel.js'

const options = {
	scheduled : false,
	timezone  : 'Europe/Bucharest'
}

const setInactiveTask = cron.schedule(
	// */10 * * * * *
	'0 3,15 * * *',
	async () => {
		const lookback = subDays(new Date(), 7)

		const games = await Game.updateMany({ updatedAt: { $lte: lookback }, isActive: true }, { isActive: false })
		console.log(`Set ${games.nModified}/${games.n} games to inactive`)
	},
	options
)

const getKickstarters = cron.schedule(
	'*/10 * * * * *',
	async () => {
		console.log('asd')
		const browser = await puppeteer.launch({ headless: false })
		const page = await browser.newPage()
		await page.goto('https://www.kickstarter.com/discover/advanced?state=live&category_id=34&sort=popularity')
		await page.waitForSelector('#projects_list')
		const data = await page.evaluate(() => {
			let documents = [ ...document.querySelectorAll('[data-pid]') ]
			let games = []
			for (let game of documents) {
				const doc = {
					image       : game.children[0].children[0].children[0].children[0].childNodes[0].children[0].src,
					title       :
						game.children[0].children[0].children[0].children[2].children[0].children[0].children[0]
							.children[0].innerText,
					description :
						game.children[0].children[0].children[0].children[2].children[0].children[0].children[0]
							.children[1].innerText
				}
				games.push(doc)
			}

			return games
		})

		console.log(data)
		await browser.close()
	},
	options
)

export { setInactiveTask, getKickstarters }
