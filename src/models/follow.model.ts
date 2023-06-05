import { Document, Schema, model, type Model } from 'mongoose'

export interface IFollow extends Document {
  follower: Schema.Types.ObjectId
  following: Schema.Types.ObjectId
}

const followSchema = new Schema<IFollow>({
  follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

export  default model<IFollow, Model<IFollow>>('Follow', followSchema)
