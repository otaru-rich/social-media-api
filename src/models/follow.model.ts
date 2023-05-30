import { Document, Schema, model, Model } from 'mongoose'

export interface Follow extends Document {
  follower: Schema.Types.ObjectId
  following: Schema.Types.ObjectId
}

const followSchema = new Schema<Follow>({
  follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

export  default model<Follow, Model<Follow>>('Follow', followSchema)
