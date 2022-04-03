import winston from 'winston'
import 'winston-daily-rotate-file'
import { __dirname } from './helpers.js'
import path from 'path'

const transport = new winston.transports.DailyRotateFile({
	filename      : path.join(__dirname, '..', 'logs', 'log-%DATE%.log'),
	datePattern   : 'DD-MM-YYYY',
	zippedArchive : true,
	maxSize       : '20m',
	maxFiles      : '7d',
	level         : 'info'
})

const winstonLogger = winston.createLogger({
	format     : winston.format.json(),
	transports : [ transport ]
})

export default winstonLogger
