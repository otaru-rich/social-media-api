import jwt from 'jsonwebtoken'
import { type Response, type NextFunction, type Request } from 'express'
import { UnauthorizedError, UserError } from '../utils/errorHandler'
import { Role } from '../types/type'

const { JWT_PRIVATE_KEY } = process.env

export const authorize = (...roles: Role[]) => {
  return (
    req: Request,
    _: Response,
    next: NextFunction
  ) => {
    validateToken(req)
    for (const role of roles) {
      if (role == req.body.role) {
        next(); return
      }
    }
    throw new UnauthorizedError(
      'Access denied. You cannot access this route'
    )
  }
}

export const validateToken = (
  req: Request
) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    req.body = { ...req.body, role: Role.GUEST }
    return
  }

  try {
    req.body = jwt.verify(token, JWT_PRIVATE_KEY!)
  } catch (error) {
    throw new UserError('Invalid token.')
  }
}
