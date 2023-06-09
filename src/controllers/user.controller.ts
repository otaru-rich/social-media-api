import { type Request, type Response } from 'express'
import { type IUser } from '../models/user.model'
import * as UserService from '../services/user.service'
import { sendResponse } from '../utils/response'
import {ServerError, ServerErrorHandler} from "../utils/errorHandler";


export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body

    // Check for valid payload
    if (!username || !email || !password) {
      return sendResponse({
        res: res,
        message: 'Bad request: all parameters are required',
        statusCode: 400
      })
    }

    // Check if the email is already registered
    const existingUser = await UserService.getUserByEmail( email );
    if (existingUser != null) {
      return res.status(409).json({ message: 'Email already exist' })
    }

    await UserService.register({
      username: username,
      email: email,
      password: password
    } as IUser);

    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    console.error('Error during user registration:', error)
    return ServerErrorHandler(new ServerError('Internal Server Error'), req, res);
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Check for valid payload
    if (!email || !password) {
      return sendResponse({
        res: res,
        message: 'Bad request: all parameters are required',
        statusCode: 400
      })
    }

    // Find the user by email
    const user = await UserService.getUserByEmail(email) as IUser
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Compare the provided password with the stored hashed password

    const isPasswordValid = await UserService.validatePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = await UserService.generateToken(user)
    return res.status(200).json({ token: token })
  } catch (error) {
    console.error('Error during user login:', error)
    return ServerErrorHandler(new ServerError('Internal Server Error'), req, res);
  }
}
