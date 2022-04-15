import mongoose from 'mongoose'
import chalk from 'chalk'
import winstonLogger from '../helpers/winstonLogger.js'

const connectDB = async () => {
	try {
		if (process.env.NODE_ENV === 'development') {
			const conn = await mongoose.connect(process.env.MONGO_URI)
			console.log(chalk.bgHex('#31754d').hex('#f7edcb').bold(`MongoDB Connected: ${conn.connection.host}`))
		} else if (process.env.NODE_ENV === 'production') {
			const conn = await mongoose.connect(process.env.MONGO_URI_PROD)

			winstonLogger.log({
				level   : 'info',
				message : {
					timestamp : new Date(),
					info      : `MongoDB Production Connected: ${conn.connection.host}`
				}
			})

			console.log(
				chalk.bgHex('#31754d').hex('#f7edcb').bold(`MongoDB Production Connected: ${conn.connection.host}`)
			)
		}
	} catch (error) {
		winstonLogger.log({
			level   : 'error',
			message : {
				timestamp : new Date(),
				error     : `ERROR DB CONNECTION - ${error}`
			}
		})
		console.log(`Error: ${error.message}`)
		process.exit(1)
	}
}

export default connectDB
