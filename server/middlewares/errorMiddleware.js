import chalk from 'chalk'

const notFound = (req, res, next) => {
	if (process.env.NODE_ENV === 'development') {
		const error = new Error(`Not found for method ${req.method} @ path ${req.path}`)
		res.status(404)
		next(error)
	} else {
		const error = new Error(`404 Not found`)
		res.status(404)
		next(error)
	}
}

const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode
	res.status(statusCode)

	if (process.env.NODE_ENV === 'development') {
		console.log(chalk.hex('#737373')('________________________________________________'))
		console.log('\n' + chalk.bgHex('#f7edcb').hex('#1c1c1c').bold('ERROR HANDLER => '), err)
		console.log(
			chalk.bgHex('#c21313').hex('#f7edcb').bold(
				'\n' +
					'Error(s): ' +
					'\n' +
					`${Object.keys(err.message)
						.map((k) => {
							return `${k}: ${err.message[k]}`
						})
						.join('\n')}` +
					'\n'
			)
		)
		console.log(chalk.hex('#737373')('________________________________________________'))
	}

	if (process.env.NODE_ENV === 'development') {
		res.json({
			timestamp : new Date(),
			status    : statusCode,
			message   : err.message,
			path      : `${req.originalUrl}`,
			devErr    : err.devErr
		})
	} else {
		res.json({
			timestamp : err.timestamp,
			status    : statusCode,
			message   : err.message,
			path      : err.path
		})
	}
}

export { notFound, errorHandler }
