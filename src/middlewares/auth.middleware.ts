import { type Response, type NextFunction, type Request } from 'express'
import jwt from 'jsonwebtoken'
import { UnauthorizedError, UserError } from '../utils/errorHandler'
import { Role } from '../types/type'

// This should not be stored in .env on a live server
const { JWT_PRIVATE_KEY } = process.env

export const authorize = (...roles: Role[]) => {
  return async (
    req: Request,
    _: Response,
    next: NextFunction
  ) => {
    await validateToken(req)
    for (const role of roles) {
      if (role === req.body.verified.role) {
        return next();
      }
    }
    throw new UnauthorizedError(
      'Access denied. You cannot access this route'
    )
  }
}

export const validateToken = async (
  req: Request
) => {

  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    req.body = { ...req.body, verified: { role: Role.GUEST }}
    return
  }

  try {
    const jwtPayload = await jwt.verify(token, JWT_PRIVATE_KEY as string)
    req.body = {...req.body, verified: jwtPayload}
  } catch (error) {
    return new UserError('Invalid token.')
  }
}
