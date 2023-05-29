import mongoose, { Schema, Document, model, Model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  user: Schema.Types.ObjectId;
  likes: string[];
  comments: string[];
}

const PostSchema: Schema = new Schema<IPost>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default model<IPost, Model<IPost>>('Post', PostSchema);
