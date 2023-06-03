import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import User, { IUser } from '../models/user.model'
import { Role } from '../types/type'

// This should not be stored in .env on a live server
const { JWT_PRIVATE_KEY } = process.env

export async function register (user: IUser) {

  // Hash the password
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(user.password, saltRounds)

  // Create a new user
  const newUser: IUser = new User({
    username: user.username,
    email: user.email,
    role: Role.USER,
    password: hashedPassword
  }) as IUser

  // Save the user to the database
  return await newUser.save()
}

export async function login (userDetails: IUser) {

  // TODO login logic goes here
}

export function getUserByEmail(email: string) {
  return User.findOne({email: email});
}
export function getUserById(followId: string) {
  return User.findById(followId);
}
export function clearUsers() {
  return User.deleteMany({});
}
export async function validatePassword(password: string, userPassword: string) {
  return bcrypt.compare(password, userPassword)
}

export async function generateToken(user: IUser): Promise<string> {
  // Generate a JWT token
  return jwt.sign({
    userId: user._id,
    role: user.role,
  }, JWT_PRIVATE_KEY as string)
}
