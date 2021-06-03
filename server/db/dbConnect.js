import mongoose from 'mongoose'

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useUnifiedTopology : true,
			useNewUrlParser    : true,
			useCreateIndex     : true
		})

		console.log(`MongoDB Connected: ${conn.connection.host}`.white.bgCyan.bold)
	} catch (error) {
		console.log(`Error: ${error.message}`.white.bgRed.bold)
		process.exit(1)
	}
}

export default connectDB
