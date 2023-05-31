import * as mongoose from 'mongoose'
import Post from '../models/post.model'

export const getPostById = (id: string) => Post.findById(id)
export const getPostsByUserId = (userId: string) => {
  const objectId = new mongoose.mongo.ObjectId(userId)
  return Post.aggregate([
    {
      $match: {
        user: objectId // Your user query condition
      }
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'post',
        as: 'likes'
      }
    }
  ])
}
export const getPostsByIds = (followingIds: string[]) => Post.find({ user: { $in: followingIds } })
export const getPostsByQuery = ({title, content}:{title?: string, content?: string}) => Post.find({
  $or: [
    { title: { $regex: title, $options: 'i' } },
    { content: { $regex: content, $options: 'i' } },
  ],
})
export const create = (values:  Record<string, any>) => new Post(values)
    .save().then((post) => post.toObject())
export const deletePostById = (postId: string) => Post.findByIdAndDelete({_id: postId})
