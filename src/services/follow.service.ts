import Follow from '../models/follow.model'

type FollowParams = {
  userId?: string,
  followId?: string
}

export const getFollows = ({ userId }: {userId: string}) => Follow.find({follower: userId});
export const getFollow = ({userId, followId}: FollowParams) => Follow.findOne({ follower: userId, following: followId });
export const createFollow = ({userId, followId}: FollowParams) => new Follow({
  follower: userId,
  following: followId
}).save().then((follow) => follow.toObject())
export const deleteFollow = ({userId, followId}: FollowParams) => Follow.findOneAndDelete({
  follower: userId,
  following: followId
});
export const clearFollows = () => Follow.deleteMany({});
