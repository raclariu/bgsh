const notFound = (req, res, next) => {
	const error = new Error(`Not found`)
	res.status(404)
	next(error)
}

const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode
	res.status(statusCode)

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
