import { Request, Response } from 'express'
import * as PostService from '../services/post.service'
import * as CommentService from '../services/comment.service'
import { sendResponse } from '../utils/response'
import {cacheResponse, redisClient} from "../services/caching.service";
import {IComment} from "../models/comment.model";
import {IPost} from "../models/post.model";
import {ServerError, ServerErrorHandler} from "../utils/errorHandler";

export const createComment = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const { verified, content } = req.body;
    const userId = verified.userId;

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
    await post.save()

    return sendResponse({
      res: res,
      data: comment,
      message: 'Comment added successfully',
      statusCode: 201
    })
  } catch (error) {
    return ServerErrorHandler(new ServerError('Internal Server Error'), req, res);
  }
}

// Controller method for retrieving comments of a post
export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { page, limit } = req.query

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
    const pageNumber = Number.parseInt(page as string, 10) || 1
    const commentLimit = Number.parseInt(limit as string, 10) || 10
    const comments = await CommentService.getComments(postId, pageNumber, commentLimit);

    res.status(200).json({
      message: 'Fetched comments successfully',
      data: comments
    });
    const cacheKey = `comments:${postId}:${page}:${limit}`;


    return cacheResponse(cacheKey,comments,res);

  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return ServerErrorHandler(new ServerError('Internal Server Error'), req, res);
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
    const comment = await CommentService.getCommentById(commentId) as IComment;
    const deletedComment = await CommentService.deleteComment(commentId).then()

    if (!deletedComment) {
      return sendResponse({
        res: res,
        message: 'Comment not found',
        statusCode: 404
      });
    }

    // Fetch post and decrement comment count
    const post = await PostService.getPostById(comment.post.toString()) as IPost;
    --post.commentsCount;
    await post.save();

    return sendResponse({
      res: res,
      message: 'Comment deleted successfully',
      statusCode: 200
    });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return ServerErrorHandler(new ServerError('Internal Server Error'), req, res);
  }
};
