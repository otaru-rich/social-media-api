import { Document, Schema, model, type Model } from 'mongoose';

export interface IComment extends Document {
  content: string;
  post: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  createdAt?: Date
}

const commentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model<IComment, Model<IComment>>('Comment', commentSchema);
