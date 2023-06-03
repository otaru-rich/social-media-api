import { type Application } from 'express'
import userRoutes from './v1/user.routes'
import postRoutes from './v1/post.routes'

export const loadRoutes = (app: Application) => {
  app.use('/api/v1/dummy', (req, res) => {
    res.status(200).json({ alive: "True" })
  })
  app.use('/api/v1/users', userRoutes)
  app.use('/api/v1/posts', postRoutes)
}
