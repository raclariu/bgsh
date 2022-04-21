import morgan from 'morgan'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { __dirname } from '../helpers/helpers.js'

morgan.token('coloredStatus', (res) => {
	if (res.statusCode >= 400) {
		return chalk.hex('#f72d3a').bold(res.statusCode)
	} else if (res.statusCode >= 300) {
		return chalk.hex('#2e98d5').bold(res.statusCode)
	} else if (res.statusCode >= 200) {
		return chalk.hex('#2ed573').bold(res.statusCode)
	} else {
		return chalk.hex('#9e9e9e').bold(res.statusCode)
	}
})

morgan.token('coloredMethod', (req) => {
	if (req.method === 'GET') {
		return chalk.hex('#51eb19').bold(req.method)
	} else if (req.method === 'POST') {
		return chalk.hex('#f9df2c').bold(req.method)
	} else if (req.method === 'PATCH') {
		return chalk.hex('#24ffc8').bold(req.method)
	} else if (req.method === 'PUT') {
		return chalk.hex('#e02f9c').bold(req.method)
	} else if (req.method === 'DELETE') {
		return chalk.hex('#f72d3a').bold(req.method)
	} else {
		return chalk.hex('#8f8f8f').bold(req.method)
	}
})

const logger = () => {
	if (process.env.NODE_ENV === 'development') {
		return morgan((tokens, req, res) =>
			[
				tokens.coloredMethod(req),
				tokens.coloredStatus(res),
				chalk.hex('#e38914').bold(tokens.url(req, res)),
				chalk.hex('#2ed573').bold(tokens['response-time'](req, res) + ' ms'),
				chalk.hex('#8f8f8f').bold.italic(`from ${tokens.referrer(req, res)}`)
				// chalk.hex('#f78fb3').bold(tokens.res(req, res, 'content-length'))
				// chalk.yellow(tokens['remote-addr'](req, res)),
				// chalk.hex('#1e90ff')(tokens['user-agent'](req, res)),
				// '\n'
			].join(' ')
		)
	} else {
		return morgan(
			':remote-addr  :method :status HTTP/:http-version  :url  :response-time[3] ms  :res[content-length]'
		)
		// return morgan('short', {
		// 	stream : fs.createWriteStream(path.join(__dirname, '..', 'logs', 'access.log'), { flags: 'a' })
		// })
	}
}

export default logger
