import Post from '../models/post.model'
import { UserId, PostParams } from '../types/type';

export const getPostsByUserId = ({ userId }: UserId) => Post.find({ user: userId });
export const create = (values: PostParams) => new Post(values)
    .save().then((post) => post.toObject());