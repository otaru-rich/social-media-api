import { Document, Schema, model, Model } from 'mongoose';

export interface Comment extends Document {
  content: string;
  post: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
}

const commentSchema = new Schema<Comment>({
  content: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default model<Comment, Model<Comment>>('Comment', commentSchema);
