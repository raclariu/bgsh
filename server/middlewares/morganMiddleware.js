import morgan from 'morgan'
import chalk from 'chalk'

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
		return chalk.hex('#9e9e9e').bold(req.method)
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
				chalk.hex('#c9c9c9').bold('from ' + tokens.referrer(req, res))
				// chalk.hex('#f78fb3').bold('@ ' + tokens.date(req, res)),
				// chalk.yellow(tokens['remote-addr'](req, res)),
				// chalk.hex('#1e90ff')(tokens['user-agent'](req, res)),
				// '\n'
			].join(' ')
		)
	} else {
		return morgan('combined')
	}
}

export default logger
