import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import chalk from 'chalk'
import connectDB from './db/dbConnect.js'
import { dailyTask } from './tasks/tasks.js'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import morganLogger from './middlewares/morganMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import collectionRoutes from './routes/collectionRoutes.js'
import gameRoutes from './routes/gameRoutes.js'
import historyRoutes from './routes/historyRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import miscRoutes from './routes/miscRoutes.js'
import listRoutes from './routes/listRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'

dotenv.config()
connectDB()
const app = express()

// @ Middlewares
app.use(cors({ origin: process.env.BASE_DOMAIN, optionSuccessStatus: 200 }))
app.use(helmet())
app.use(morganLogger())
app.use(express.json())

// @ Routes middleware
app.use('/api/users', userRoutes)
app.use('/api/collections', collectionRoutes)
app.use('/api/games', gameRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/list', listRoutes)
app.use('/api/misc', miscRoutes)
app.use('/api/notifications', notificationRoutes)

app.get('/', (req, res) => {
	return res.status(200).send('Api is running...')
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	dailyTask.start()

	console.log(chalk.bgBlue.hex('#f7edcb').bold(`setInactiveTask starting... running every 2 hours`))
	console.log(chalk.bgYellow.hex('#f7edcb').bold(`Server running in ${process.env.NODE_ENV} mode @ port ${PORT}`))
})
