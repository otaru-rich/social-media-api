import Post from '../models/post.model'

export const getPostsByUserId = (userId: string) => Post.find({ user: userId });
export const create = (values:  Record<string, any>) => new Post(values)
    .save().then((post) => post.toObject());
export const deletePostById = (postId: string) => Post.findByIdAndDelete({_id: postId});
