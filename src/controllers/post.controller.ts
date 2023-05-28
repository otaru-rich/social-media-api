import { Request, Response } from 'express';
import * as PostService from '../services/post.service';
import { sendResponse } from '../utils/response';

export const createPosts = async (req: Request, res: Response) => {
  try {
    const { userId, title, content } = req.body;

    // // Create a new post
    const newPost = await PostService.create({ title, content, userId });

    sendResponse({res: res, data: newPost, message: 'Post created successfully', statusCode: 201});
  } catch (error) {
    console.error(error);
    sendResponse({res: res, data: {}, message: 'Internal server error', statusCode: 500});
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    
    // Fetch user's posts from the database
    const posts = await PostService.getPostsByUserId({ userId });
    
    res.json({ posts });
  } catch (error) {
    console.error(error);
    sendResponse({res: res, data: {}, message: 'Internal server error', statusCode: 500});
  }
};