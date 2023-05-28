import mongoose from 'mongoose'
import { DatabaseError } from '../utils/errorHandler'
import { logger } from '../utils/logger'
import * as dotenv from 'dotenv'
dotenv.config()

const { DB_URI } = process.env

export async function connectDB(dbURI = DB_URI!) {
    return await mongoose
        .connect(dbURI)
        .then(() => logger.info(`Connected to ${dbURI} 💃`))
        .catch((e: Error) => {
            throw new DatabaseError(e.message)
        })
}

export async function disconnectDB() {
    return await mongoose.connection
        .close()
        .then(() => logger.info('Disconnected 💃'))
        .catch((e: Error) => {
            throw new DatabaseError(e.message)
        })
}
