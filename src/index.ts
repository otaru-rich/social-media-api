import express from 'express'
import http from 'http'
import * as dotenv from 'dotenv'
import { connectDB } from './config/database'
import { logger } from './utils/logger'
import { NotFoundErrorHandler, ServerErrorHandler } from './utils/errorHandler'
import { loadRoutes } from './routes/routes'
// import {initializeRedisClient} from "./middlewares/redis.middleware";

// Expose .env variable globally
dotenv.config()

const { PORT } = process.env

// Create Express app
export const app = express()
export const server = http.createServer(app)

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
server.listen(PORT || 8080, () => {
  logger.info(`Server is listening on port: ${PORT}`)
})

process.on('uncaughtException', function (err) {
  logger.error(err.message)
  logger.error(err.stack)
})
