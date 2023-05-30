import { type Request, type Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User, { type IUser } from '../models/user.model'
import { Role } from '../types/type'
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
    const existingUser = await User.findOne({ email })
    if (existingUser != null) {
      return res.status(400).json({ message: 'Email already exist' })
    }

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create a new user
    const newUser: IUser = new User({
      username,
      email,
      role: Role.USER,
      password: hashedPassword
    }) as IUser

    // Save the user to the database
    await newUser.save()

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
    const user = await User.findOne({ email }) as IUser
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    // Generate a JWT token
    const token = jwt.sign({
      userId: user._id,
      role: user.role,
    }, 'INTANA-SUPER-SECRETE')

    res.status(200).json({ token })
  } catch (error) {
    console.error('Error during user login:', error)
    res.status(500).json({ message: 'An error occurred during user login' })
  }
}
