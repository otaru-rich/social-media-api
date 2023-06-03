import { Schema, type Document, model, type Model } from 'mongoose'

export interface IUser extends Document {
  username: string
  email: string
  role?: string
  password: string
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  password: { type: String, required: true }
})

export default model<IUser, Model<IUser>>('User', UserSchema)
