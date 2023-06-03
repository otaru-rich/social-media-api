import { type Request, type Response } from 'express'
import { type IUser } from '../models/user.model'
import * as UserService from '../services/user.service'
import { sendResponse } from '../utils/response'

const { JWT_PRIVATE_KEY } = process.env

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
    res.status(500).json({ message: 'An error occurred during user registration' })
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

    const isPasswordValid = UserService.validatePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    console.log('USER FROM LOGIN CONTROLLER: ', user)
    const token = await UserService.generateToken(user)
    res.status(200).json({ token })
  } catch (error) {
    console.error('Error during user login:', error)
    res.status(500).json({ message: 'An error occurred during user login' })
  }
}
