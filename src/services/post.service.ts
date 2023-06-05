import * as mongoose from 'mongoose'
import Post, {IPost} from '../models/post.model'

export const getPostById = (id: string):  Promise<IPost | null> => Post.findById(id).exec();

export const getPostsByUserId = (userId: string, page: number, limit: number): Promise<IPost[]> => {
  const objectId = new mongoose.mongo.ObjectId(userId)
  return Post.find({ user: objectId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'username') // from user model
    .exec();
}

export const getPostsByIds = (followingIds: string[], page: number, limit: number ): Promise<IPost[]> => {
  return Post.find({ user: { $in: followingIds } })
    .sort({ createdAt: "desc" })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'username') // from user model
    .exec();
}

export const getPostsByQuery = (userId: string, {keyword,tags}:{keyword?: string, tags?: string}, page: number, limit: number ): Promise<IPost[]> => Post
    .find({
  $or: [
    { title: { $regex: keyword, $options: 'i' } },
    { content: { $regex: tags, $options: 'i' } },
  ],
    user: { $eq: userId },})
    .sort({ createdAt: "desc" })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'username') // from user model
    .exec();

export const create = (values:  Record<string, any>) => new Post(values)
    .save().then((post) => post.toObject());

export const deletePostById = (postId: string) => Post.findByIdAndDelete({_id: postId});

export const clearPosts = () => Post.deleteMany({});
