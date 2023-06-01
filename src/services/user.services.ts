import User, { type IUser } from '../models/user.model'

export async function register (user: IUser) {

  // TODO register logic goes here
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
