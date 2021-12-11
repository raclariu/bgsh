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

	console.log(err)
	console.log(`Error: ${err.message}`.white.bgRed.bold)

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
