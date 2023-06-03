import { Request, Response } from 'express'
import * as PostService  from '../services/post.service'
import { sendResponse } from '../utils/response'

export const searchPosts = async (req: Request, res: Response) => {
  try {
    const { keyword, tags }  = req.query

    // Check for valid payload
    if (!(keyword || tags)) {
      return res.status(400).json({
        message: 'Bad request'
      });
    }

    // Perform a case-insensitive search for posts containing the query in the title or content
    const posts = await PostService.getPostsByQuery({
      title: keyword as string,
      content: tags as string
    })

    return res.status(200).json({
      message: 'Fetched posts successfully',
      data: posts
    });
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
