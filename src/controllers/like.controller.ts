import { Request, Response } from 'express';
import * as Post  from '../services/post.service';
import { sendResponse } from '../utils/response'

export const likePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const userId = req.body.userId;

    // Check for valid payload
    if (!postId || !userId) {
      return sendResponse({
        res: res,
        message: 'Bad request: all parameters are required',
        statusCode: 400
      })
    }

    // Find the post
    const post = await Post.getPostById(postId)
    if (!post) {
      return sendResponse({
        res: res,
        message: 'Post not found',
        statusCode: 404
      })
    }

    // Check if the post is already liked by the user
    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      return res.status(400).json({ message: 'Post is already liked' });
    }

    // Add the user to the list of likes
    post.likes.push(userId);
    await post.save();

    res.json({ message: 'Post liked successfully' });
    return sendResponse({
      res: res,
      message: 'Post liked successfully',
      statusCode: 204
    })
  } catch (error) {
    console.error(error);
    return sendResponse({
      res: res,
      message: 'Internal server error',
      statusCode: 500
    })
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const userId = req.body.userId;

    // Check for valid payload
    if (!postId || !userId) {
      return sendResponse({
        res: res,
        message: 'Bad request: all parameters are required',
        statusCode: 400
      })
    }

    // Find the post
    const post = await Post.getPostById(postId);
    if (!post) {
      return sendResponse({
        res: res,
        message: 'Post not found',
        statusCode: 404
      });
    }

    // Check if the post is liked by the user
    const isLiked = post.likes.includes(userId);
    if (!isLiked) {
      return sendResponse({
        res: res,
        message: 'Post is not liked',
        statusCode: 400
      });
    }

    // Remove the user from the list of likes
    post.likes = post.likes.filter((like) => like.toString() !== userId);
    await post.save();

    res.json({ message: 'Post unliked successfully' });
    return sendResponse({
      res: res,
      message: 'Post unliked successfully',
      statusCode: 204
    });
  } catch (error) {
    console.error(error);
    return sendResponse({
      res: res,
      message: 'Internal server error',
      statusCode: 500
    });
  }
};
