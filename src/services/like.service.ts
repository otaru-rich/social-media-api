import Like from '../models/like.model'

type LikeParams = {
  postId: string,
  userId: string
}

export const getLikes = () => Like.find()

export const getLikesByPostId = ({ postId }: {postId: string}) => Like.find({post: postId})

export const getLike = ({postId, userId}: LikeParams) => Like.findOne({ post: postId, user: userId })

export const createLike = ({postId, userId}: LikeParams) => new Like({
  post: postId,
  user: userId
}).save().then((like) => like.toObject())

export const deleteLike = ({postId, userId}: LikeParams) => Like.findOneAndDelete({
  post: postId,
  user: userId
})

export const clearLikes = () => Like.deleteMany({});
