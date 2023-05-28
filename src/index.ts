import express from 'express'
import { connectDB } from './config/database'
import { logger } from './utils/logger'

const { PORT } = process.env

// Create Express app
const app = express()

// Configure app to parse JSON request bodies
app.use(express.json())

// connect DB
await connectDB()

// connect to server
app.listen(PORT || 8080, () => {
  logger.info(`Server is listening on port: ${PORT}`)
})

process.on('uncaughtException', function (err) {
  logger.error(err.message);
  logger.error(err.stack);
});
