import { Request, Response } from 'express'
import * as PostService from '../services/post.service'
import * as CommentService from '../services/comment.service'
import { sendResponse } from '../utils/response'

export const createComment = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const { userId, content } = req.body;

    // Check for valid parameters
    if (!postId || !userId || !content) {
      return sendResponse({
        res: res,
        message: 'Bad request: all parameters are required',
        statusCode: 400
      })
    }

    // Find the post
    const post = await PostService.getPostById(postId);
    if (!post) {
      return sendResponse({
        res: res,
        message: 'Post not found',
        statusCode: 404
      })
    }

    // Create new comment
    const comment = await CommentService.create({
      content: content,
      post: post._id.toString(),
      user: userId
    })

    // Increment post comment count
    post.commentsCount = post.commentsCount + 1
    post.save()

    return sendResponse({
      res: res,
      data: comment,
      message: 'Comment added successfully',
      statusCode: 201
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

// Controller method for retrieving comments of a post
export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    // Check for valid payload
    if (!postId) {
      return res.status(400).json({
        message: 'Bad request'
      });
    }

    // Check if the post exists
    const post = await PostService.getPostById(postId);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }

    // Find all comments associated with the post
    const comments = await CommentService.getComments(postId);

    return res.status(200).json({
      message: 'Fetched comments successfully',
      data: comments
    });
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return sendResponse({
      res: res,
      message: 'Failed to fetch comment',
      statusCode: 500
    });
  }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId

    // Check for valid payload
    if (!commentId) {
      return sendResponse({
        res: res,
        message: 'Comment not found',
        statusCode: 404
      })
    }

    // Find and delete the comment
    const deletedComment = await CommentService.deleteComment(commentId)

    if (!deletedComment) {
      return sendResponse({
        res: res,
        message: 'Comment not found',
        statusCode: 404
      });
    }

    // TODO Decrement post comment count


    return sendResponse({
      res: res,
      message: 'Comment deleted successfully',
      statusCode: 200
    });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return sendResponse({
      res: res,
      message: 'Failed to delete comment',
      statusCode: 500
    });
  }
};
