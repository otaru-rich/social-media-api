import { type Application } from 'express'
import userRoutes from './v1/user.routes'

export const loadRoutes = (app: Application) => {
  app.use('/api/v1/dummy', (req, res) => {
    res.status(200).json({ alive: "True" });
  })
  app.use('/api/v1/user', userRoutes)
}
