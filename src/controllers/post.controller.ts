import { Request, Response } from 'express'
import * as PostService from '../services/post.service'
import { sendResponse } from '../utils/response'
import * as Follow from '../services/follow.service'
import * as Post from '../services/post.service'

export const createPost = async (req: Request, res: Response) => {
  try {
    const { userId, title, content } = req.body

    //Check if payload is valid
    if (!userId || !title || !content) {
      sendResponse({res: res, message: 'Bad request: all parameters are required', statusCode: 400})
    }

    // // Create a new post
    const newPost = await PostService.create({ title: title, content: content, user: userId })

    sendResponse({res: res, data: newPost, message: 'Post created successfully', statusCode: 201})
  } catch (error) {
    console.error(error);
    sendResponse({res: res, message: 'Internal server error', statusCode: 500})
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId

    // Check if payload is valid
    if (!userId) {
      sendResponse({res: res, message: 'Bad request: userId is required', statusCode: 400})
    }

    // Fetch user's posts from the database
    const posts = await PostService.getPostsByUserId(userId)

    sendResponse({res: res, data: posts, message: 'Posts fetched successfully', statusCode: 200})
  } catch (error) {
    console.error(error)
    sendResponse({res: res, message: 'Internal server error', statusCode: 500})
  }
}

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params
    const { title, content } = req.body

    //Check if payload is valid
    if (!postId || !title || !content) {
      sendResponse({res: res, message: 'Bad request: all parameters are required', statusCode: 400})
    }

    // Fetch post
    const post = await PostService.getPostById(postId)

    // Check if post exist
    if (!post) {
      return sendResponse({res: res, message: 'Resource not found', statusCode: 404})
    }

    // // Update post
    post.title = title
    post.content = content
    const updatedPost = await post.save()

    sendResponse({res: res, data: updatedPost, message: 'Post updated successfully', statusCode: 200})
  } catch (error) {
    console.error(error)
    sendResponse({res: res, message: 'Internal server error', statusCode: 500})
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

    sendResponse({res: res, data: deletedPost, message: 'Post deleted successfully', statusCode: 200})
  } catch (error) {
    console.error(error)
    sendResponse({res: res, message: 'Internal server error', statusCode: 500})
  }
}

export const getFollowingPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId

    // Check for valid payload
    if (!userId) {
      return sendResponse({
        res: res,
        message: 'Bad request: all parameters are required',
        statusCode: 400
      })
    }
    // Fetch posts from users that the authenticated user is following
    const following = await Follow.getFollows({ userId: userId })
    const followingIds = following.map((follow) => follow.following.toString())

    const posts = await Post.getPostsByIds(followingIds);

    return sendResponse({
      res: res,
      data: posts,
      message: 'Fetched following posts successfully',
      statusCode: 200
    })
  } catch (error) {
    console.error(error)
    return sendResponse({
      res: res,
      message: 'Internal server error',
      statusCode: 500
    })
  }
}
