import * as mongoose from 'mongoose'
import Post from '../models/post.model'

export const getPostById = (id: string) => Post.findById(id)
export const getPostsByUserId = (userId: string, page: number, limit: number) => {
  const objectId = new mongoose.mongo.ObjectId(userId)
  return Post.find({ user: objectId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'username') // from user model
    .exec();
}
export const getPostsByIds = (followingIds: string[], page: number, limit: number ) => {
  return Post.find({ user: { $in: followingIds } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'username') // from user model
    .exec();
}
export const getPostsByQuery = ({keyword,tags}:{keyword?: string, tags?: string}) => Post.find({
  $or: [
    { title: { $regex: keyword, $options: 'i' } },
    { content: { $regex: tags, $options: 'i' } },
  ],
});
export const create = (values:  Record<string, any>) => new Post(values)
    .save().then((post) => post.toObject());
export const deletePostById = (postId: string) => Post.findByIdAndDelete({_id: postId});
export const clearPosts = () => Post.deleteMany({});
