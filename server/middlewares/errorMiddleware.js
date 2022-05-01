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

	console.error({
		error : {
			code      : err.code || null,
			timestamp : new Date(),
			status    : statusCode,
			message   : err.message,
			path      : req.originalUrl,
			devErr    : err.devErr,
			ref       : req.headers.referer,
			method    : req.method || null
		}
	})

	if (process.env.NODE_ENV === 'development') {
		console.log(chalk.hex('#737373')('________________________________________________'))
		console.log(chalk.bgHex('#f7edcb').hex('#1c1c1c').bold('\nERROR HANDLER\n'), err)
		if (typeof err.message === 'object') {
			console.log(
				chalk.bgHex('#c21313').hex('#f7edcb').bold(
					'\n' +
						'Error(s)' +
						'\n' +
						`${Object.keys(err.message)
							.map((k) => {
								return `${k}: ${err.message[k]}`
							})
							.join('\n')}` +
						'\n'
				)
			)
		} else if (typeof err.message === 'string') {
			console.log(chalk.bgHex('#c21313').hex('#f7edcb').bold('\n' + 'Error(s)' + '\n' + `${err.message}` + '\n'))
		}

		console.log(chalk.hex('#737373')('________________________________________________'))
	}

	if (process.env.NODE_ENV === 'development') {
		return res.json({
			code      : err.code || null,
			timestamp : new Date(),
			status    : statusCode,
			message   : err.message,
			path      : `${req.originalUrl}`,
			devErr    : err.devErr
		})
	} else {
		return res.json({
			code      : err.code || null,
			timestamp : err.timestamp,
			status    : statusCode,
			message   : err.message,
			path      : err.path
		})
	}
}

export { notFound, errorHandler }
