import { Schema, Document, model, type Model } from 'mongoose'

export interface IPost extends Document {
  title: string
  content: string
  user: Schema.Types.ObjectId
  createdAt?: Date
  likesCount: number
  commentsCount: number
}

const PostSchema: Schema = new Schema<IPost>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, },
  likesCount: { type: Number, default: 0, },
  commentsCount: { type: Number, default: 0, },
});

export default model<IPost, Model<IPost>>('Post', PostSchema)
