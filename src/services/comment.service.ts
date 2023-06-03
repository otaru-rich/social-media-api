import Comment from '../models/comment.model'
import Post from '../models/post.model'

export const getCommentById = (commentId: string) => Comment.findById(commentId)
export const getComments = ( postId: string, page: number, limit: number) => {
  return Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'username') // from user model
    .exec();
};
export const create = (value: Record<string, any>) => new Comment(value)
  .save().then((comment) => comment.toObject())
export const deleteComment = (id: string) => Comment.findByIdAndDelete(id);
export const clearComments = () => Comment.deleteMany({});
