import express from 'express'
import { connectDB } from './config/database'
import { logger } from './utils/logger'
import { NotFoundErrorHandler, ServerErrorHandler } from './utils/errorHandler'
import { loadRoutes } from './routes/routes'

const { PORT } = process.env

// Create Express app
const app = express()

// Configure app to parse JSON request bodies
app.use(express.json())

// connect DB
connectDB()

// load routes
loadRoutes(app)

// Handle Errors
app.use(NotFoundErrorHandler)
app.use(ServerErrorHandler)

// connect to server
app.listen(PORT || 8080, () => {
  logger.info(`Server is listening on port: ${PORT}`)
})

process.on('uncaughtException', function (err) {
  logger.error(err.message)
  logger.error(err.stack)
})
