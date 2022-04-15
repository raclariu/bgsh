import winston from 'winston'
import { __dirname } from './helpers.js'
import path from 'path'

const winstonLogger = winston.createLogger({
	level      : 'info',
	format     : winston.format.json(),
	transports : [
		new winston.transports.File({ filename: path.join(__dirname, '..', 'logs', 'error.log'), level: 'error' }),
		new winston.transports.File({ filename: path.join(__dirname, '..', 'logs', 'combined.log') })
	]
})

export default winstonLogger
