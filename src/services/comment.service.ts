import Comment from '../models/comment.model'

type GetCommentsParams = {
  id?: string
  post?: string
  user?: string
}

export const getComments = ({id, post, user}: GetCommentsParams) => {
  return Comment.find({
    id: id,
    user: user,
    post: post
  })
}
export const create = (value: Record<string, any>) => new Comment(value)
  .save().then((comment) => comment.toObject())
export const deleteComment = (id: string) => Comment.findByIdAndDelete(id);
