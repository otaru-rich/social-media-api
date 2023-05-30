import { type Application } from 'express'
import userRoutes from './v1/user.routes'
import postRoutes from './v1/post.routes'
import likeRoutes from './v1/like.routes'
import commentRoutes from './v1/comment.routes'
import followRoutes from './v1/follow.routes'
import searchRoutes from './v1/search.routes'

export const loadRoutes = (app: Application) => {
  app.use('/api/v1/dummy', (req, res) => {
    res.status(200).json({ alive: "True" })
  })
  app.use('/api/v1/users', userRoutes)
  app.use('/api/v1/posts', postRoutes)
  app.use('/api/v1/like', likeRoutes)
  app.use('/api/v1/comments', commentRoutes)
  app.use('/api/v1/follow', followRoutes)
  app.use('/api/v1/search', searchRoutes);
}
