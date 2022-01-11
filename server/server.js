import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import colors from 'colors'
import path from 'path'
import cors from 'cors'
import connectDB from './db/dbConnect.js'
import { setInactiveTask, getKickstarters } from './tasks/tasks.js'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import collectionRoutes from './routes/collectionRoutes.js'
import gameRoutes from './routes/gameRoutes.js'
import historyRoutes from './routes/historyRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import miscRoutes from './routes/miscRoutes.js'
const __dirname = path.resolve()

dotenv.config()

connectDB()

const app = express()

app.use(cors())
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}
app.use(express.json())
app.use(express.static(path.join(__dirname, './public')))

app.use('/api/users', userRoutes)
app.use('/api/collections', collectionRoutes)
app.use('/api/games', gameRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/misc', miscRoutes)

app.get('/', (req, res) => {
	res.send('Api is running...')
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	setInactiveTask.start()
	//getKickstarters.start()
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.white.bgMagenta.bold)
	console.log(`setInactiveTask starting... running every day at 03:00 and 15:00`.yellow.bgBlue.bold)
})
