import Post from '../models/post.model'

export const getPostById = (id: string) => Post.findById(id)
export const getPostsByUserId = (userId: string) => Post.find({ user: userId })
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
