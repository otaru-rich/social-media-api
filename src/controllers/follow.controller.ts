import { Request, Response } from 'express'
import * as UserService from '../services/user.service'
import * as FollowService from '../services/follow.service'
import { sendResponse } from '../utils/response'

export const followUser = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const { followId } = req.params;

    // Check if payload is valid
    if (!userId || !followId) {
      return sendResponse({
        res: res,
        message: 'Bad request: all parameters are required',
        statusCode: 400
      })
    }

    // Check if the user to follow exists
    const userToFollow = await UserService.getUserById(followId)
    if (!userToFollow) {
      return sendResponse({
        res: res,
        message: 'User not found',
        statusCode: 404
      })
    }

    // Check if the user is already following the target user
    const isFollowing = await FollowService.getFollow({
      userId: userId,
      followId: followId
    })

    if (isFollowing) {
      return sendResponse({
        res: res,
        message: 'User is already being followed',
        statusCode: 400
      })
    }

    // Create a new following relationship
    const newFollowing = await  FollowService.createFollow({
      userId: userId,
      followId: followId
    })

    return sendResponse({
      res: res,
      message: 'User followed successfully',
      statusCode: 200
    })
  } catch (error) {
    console.error(error);
    return sendResponse({
      res: res,
      message: 'Internal server error',
      statusCode: 500
    })
  }
}


export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const { followId } = req.params;

    // Check for valid payload
    if (!userId || !followId) {
      return sendResponse({
        res: res,
        message: 'Bad request: all parameters are required',
        statusCode: 400
      })
    }

    // Check if the user to unfollow exists
    const userToUnfollow = await UserService.getUserById(followId);
    if (!userToUnfollow) {
      return sendResponse({
        res: res,
        message: 'User not found',
        statusCode: 404
      })
    }

    // Check if the user is already not following the target user
    const isFollowing = await FollowService.getFollow({
      userId: userId,
      followId: followId
    })

    if (!isFollowing) {
      return sendResponse({
        res: res,
        message: 'User is not being followed',
        statusCode: 400
      })
    }

    // Delete the following relationship
    await FollowService.deleteFollow({
      userId: userId,
      followId: followId
    })

    return sendResponse({
      res: res,
      message: 'User unfollowed successfully',
      statusCode: 200
    })
  } catch (error) {
    console.error(error);
    return sendResponse({
      res: res,
      message: 'Internal server error',
      statusCode: 500
    })
  }
}
