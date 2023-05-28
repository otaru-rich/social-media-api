import mongoose, { Schema, Document, model, Model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  user: string;
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default model<IPost, Model<IPost>>('Post', PostSchema);