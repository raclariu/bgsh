import cron from 'node-cron'
import puppeteer from 'puppeteer'
import chalk from 'chalk'
import { subDays } from 'date-fns'
import Game from '../models/gameModel.js'
import Kickstarter from '../models/ksModel.js'
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
					thumbnail : obj.games[0].thumbnail
				}
			})
		}

		await Notification.insertMany(notifArr)
		notifArr = []

		const modify = await Game.updateMany({ isActive: true, updatedAt: { $lte: lookback } }, { isActive: false })

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

const fetchKickstarters = cron.schedule(
	'0 17 * * *',
	//'0 7,17 * * *',
	//'*/10 * * * * *',
	async () => {
		const args = [
			'--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36"',
			'--no-sandbox',
			'--disable-setuid-sandbox'
		]

		let browser
		console.log('Starting task')
		try {
			console.log('Opening browser')
			browser = await puppeteer.launch({
				executablePath    : '/usr/bin/chromium-browser',
				args,
				headless          : true,
				ignoreHTTPSErrors : true
			})
			console.log('Selecting page')
			const page = (await browser.pages())[0]

			console.log('Go to page')
			await page.goto('https://www.kickstarter.com/discover/advanced?state=live&category_id=34&sort=popularity')
			// await page.screenshot({ path: './kickstarter.png' })
			console.log('Wait for selector')
			await page.waitForSelector('#projects_list')

			console.log('Evaluate')
			const data = await page.evaluate(() => {
				let kickstartersRaw = []

				let documents = [ ...document.querySelectorAll('[data-pid]') ]

				for (let ks of documents) {
					kickstartersRaw.push(JSON.parse(ks.dataset.project))
				}

				const kickstarters = kickstartersRaw.map((ks) => {
					return {
						ksId             : ks.id,
						title            : ks.name,
						shortDescription : ks.blurb,
						backers          : ks.backers_count,
						pledged          : ks.converted_pledged_amount,
						goal             : ks.goal,
						percentFunded    : ks.percent_funded,
						url              : ks.urls.web.project,
						creator          : ks.creator.name,
						exchangeRate     : ks.usd_exchange_rate,
						location         : ks.location.displayable_name,
						launched         : ks.launched_at,
						deadline         : ks.deadline,
						image            : ks.photo.ed
					}
				})

				return kickstarters
			})

			console.log('Close browser')
			await browser.close()

			await Kickstarter.deleteMany({})
			await Kickstarter.insertMany(data)

			console.log(chalk.hex('#737373')('_____________________________________________'))
			console.log(
				chalk
					.bgHex('#85b500')
					.hex('#f7edcb')
					.bold('\n' + `Ran kickstarter task at ${new Date().toLocaleString('ro-RO')}` + '\n')
			)
			console.log(chalk.hex('#737373')('_____________________________________________'))
		} catch (error) {
			console.error(error)
			await browser.close()
		}
	},
	options
)

export { dailyTask, fetchKickstarters }
