import Follow, {IFollow} from '../models/follow.model'

type FollowParams = {
  userId?: string,
  followId?: string
}

export const getFollow = ({userId, followId}: FollowParams):Promise<IFollow | null>  =>
    Follow.findOne({ follower: userId, following: followId }).exec();

export const getFollows = ({ userId }: {userId: string}): Promise<IFollow[]> =>
    Follow.find({follower: userId}).exec();

export const createFollow = ({userId, followId}: FollowParams) => new Follow({
  follower: userId,
  following: followId
}).save().then((follow) => follow.toObject())

export const deleteFollow = ({userId, followId}: FollowParams) => Follow.findOneAndDelete({
  follower: userId,
  following: followId
});

export const clearFollows = () => Follow.deleteMany({});
