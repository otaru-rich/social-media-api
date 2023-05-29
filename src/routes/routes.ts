import { type Application } from 'express'
import userRoutes from './v1/user.routes'
import postRoutes from './v1/post.routes'
import likeRoutes from './v1/like.routes'

export const loadRoutes = (app: Application) => {
  app.use('/api/v1/dummy', (req, res) => {
    res.status(200).json({ alive: "True" })
  })
  app.use('/api/v1/user', userRoutes)
  app.use('/api/v1/post', postRoutes)
  app.use('/api/v1/like/', likeRoutes)
}
