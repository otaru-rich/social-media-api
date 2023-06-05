import { type Response, type NextFunction, type Request } from 'express'
import jwt from 'jsonwebtoken'
import {ServerErrorHandler, UnauthorizedError, UserError} from '../utils/errorHandler'
import { Role } from '../types/type'

// This should not be stored in .env on a live server
const { JWT_PRIVATE_KEY } = process.env

export const authorize = (...roles: Role[]) => {
  return async (
    req: Request,
    _: Response,
    next: NextFunction
  ) => {

    try {
      await validateToken(req)
      for (const role of roles) {
        if (role === req.body.verified.role) {
          console.log('Passed  here:');

          return next();
        }
      }
    } catch (error) {
      ServerErrorHandler(new UnauthorizedError(
          'Access denied. You cannot access this route'
      ), req, _)
    }
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
    throw new UserError('Invalid token.')
  }
}
