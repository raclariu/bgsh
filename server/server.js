import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import colors from 'colors'
import connectDB from './db/dbConnect.js'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import collectionRoutes from './routes/collectionRoutes.js'
import gameRoutes from './routes/gameRoutes.js'

dotenv.config()

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/collections', collectionRoutes)
app.use('/api/games', gameRoutes)

app.get('/', (req, res) => {
	res.send('Api is running...')
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))
