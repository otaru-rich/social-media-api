import { Document, Schema, model, Model } from 'mongoose'

export interface Like extends Document {
  post: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
}

const LikeSchema = new Schema<Like>({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

export  default model<Like, Model<Like>>('Like', LikeSchema)
