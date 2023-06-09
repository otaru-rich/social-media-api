import Comment, {IComment} from '../models/comment.model'
import Post from '../models/post.model'

export const getCommentById = (commentId: string): Promise<IComment | null> => Comment.findById(commentId).exec();

export const getComments = ( postId: string, page: number, limit: number): Promise<IComment[]> => {
  return Comment.find({ post: postId })
    .sort({ createdAt: "desc" })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'username') // from user model
    .exec();
};

export const create = (value: Record<string, any>) => new Comment(value)
  .save().then((comment) => comment.toObject())

export const deleteComment = (id: string) => Comment.findByIdAndDelete(id);

export const clearComments = () => Comment.deleteMany({});
