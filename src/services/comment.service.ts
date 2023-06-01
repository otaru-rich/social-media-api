import Comment from '../models/comment.model'

export const getComments = ( postId: string) => Comment.find({ post: postId });
export const create = (value: Record<string, any>) => new Comment(value)
  .save().then((comment) => comment.toObject())
export const deleteComment = (id: string) => Comment.findByIdAndDelete(id);
export const clearComments = () => Comment.deleteMany({});
