import mongoose from 'mongoose'
import chalk from 'chalk'

const connectDB = async () => {
	try {
		if (process.env.NODE_ENV === 'development') {
			const conn = await mongoose.connect(process.env.MONGO_URI)
			console.log(chalk.bgHex('#31754d').hex('#f7edcb').bold(`MongoDB Dev Connected: ${conn.connection.host}`))
		} else if (process.env.NODE_ENV === 'production') {
			const conn = await mongoose.connect(process.env.MONGO_URI_PROD)
			console.log(
				chalk.bgHex('#31754d').hex('#f7edcb').bold(`MongoDB Production Connected: ${conn.connection.host}`)
			)
		}
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

export default connectDB
