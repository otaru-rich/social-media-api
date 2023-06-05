import {Request, Response} from 'express'
import * as PostService from '../services/post.service'
import { sendResponse } from '../utils/response'
import * as FollowService from '../services/follow.service'
import * as UserService from '../services/user.service'
import {cacheResponse} from "../services/caching.service";
import {ServerError, ServerErrorHandler} from "../utils/errorHandler";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { verified, title, content } = req.body
    const userId = verified?.userId;
    // Check if payload is valid
    if (!userId || !title || !content) {
      return sendResponse({res: res, message: 'Bad request: all parameters are required', statusCode: 400})
    }

    // Check if user exist
    const user = await UserService.getUserById(userId)
    if (!user) {
      sendResponse({
        res: res,
        message: `User doesn't exist`,
        statusCode: 404
      })
    }

    // // Create a new post
    const newPost = await PostService.create({ title: title, content: content, user: userId })

    return sendResponse({
      res: res,
      data: newPost,
      message: 'Post created successfully',
      statusCode: 201
    })
  } catch (error) {
    console.error(error);
    return sendResponse({res: res, message: 'Internal server error', statusCode: 500})
  }
};

export const getUserPosts = async (req:any, res:any) => {
  try {
    const userId = req.body.verified?.userId
    const { page, limit } = req.query

    // Check if payload is valid
    if (!userId) {
      return res.status(400).json({
        message: 'Bad request',
      });
    }

    // Fetch user's posts from the database
    const pageNumber = Number.parseInt(page as string, 10) || 1
    const postLimit = Number.parseInt(limit as string, 10) || 10
    const posts = await PostService.getPostsByUserId(userId, pageNumber, postLimit)

    res.status(200).json({
      message: 'Fetched posts successfully',
      data: posts
    });
    const cacheKey = `posts:${userId}:${page}:${limit}`;

    return cacheResponse(cacheKey, posts, res);
  } catch (error) {
    console.error(error)
    return sendResponse({res: res, message: 'Internal server error', statusCode: 500})
  }
}

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params
    const { title, content } = req.body

    //Check if payload is valid
    if (!postId || !title || !content) {
      return sendResponse({res: res, message: 'Bad request: all parameters are required', statusCode: 400})
    }

    // Fetch post
    const post = await PostService.getPostById(postId)

    // Check if post exist
    if (!post) {
      return sendResponse({res: res, message: 'Resource not found', statusCode: 404})
    }

    // Update post
    post.title = title
    post.content = content
    const updatedPost = await post.save()

    return sendResponse({res: res, data: updatedPost, message: 'Post updated successfully', statusCode: 200})
  } catch (error) {
    console.error(error)
    return sendResponse({res: res, message: 'Internal server error', statusCode: 500})
  }
}

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId

    // Check if payload is valid
    if (!postId) {
      return sendResponse({res: res, message: 'Bad request: postId is required', statusCode: 400})
    }

    // Delete posts from the database
    const deletedPost = await PostService.deletePostById(postId)

    // Check if delete action was successful
    if (!deletedPost) {
      return sendResponse({res: res, message: 'Resource not found', statusCode: 404})
    }

    return sendResponse({res: res, data: deletedPost, message: 'Post deleted successfully', statusCode: 200})
  } catch (error) {
    console.error(error)
    return sendResponse({res: res, message: 'Internal server error', statusCode: 500})
  }
}

export const getFollowingPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.body.verified?.userId
    const { page, limit } = req.query

    // Check for valid payload
    if (!userId) {
      return res.status(400).json({
        message: 'Bad request',
      });
    }

    // Fetch posts from users that the authenticated user is following
    const following = await FollowService.getFollows({ userId: userId })

    const followingIds = following.map((follow) => follow.following.toString() )

    const pageNumber = Number.parseInt(page as string, 10) || 1
    const postLimit = Number.parseInt(limit as string, 10) || 10
    const posts = await PostService.getPostsByIds(followingIds, pageNumber, postLimit);

    res.status(200).json({
      message: 'Fetched following posts successfully',
      data: posts
    });

    const cacheKey = `following:${userId}:${page}:${limit}`;

    return cacheResponse(cacheKey, posts, res);
  } catch (error) {
    console.error(error)
    return ServerErrorHandler(new ServerError('Internal Server Error'), req, res);
  }
}
