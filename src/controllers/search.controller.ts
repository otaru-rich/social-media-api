import { Request, Response } from 'express'
import * as Post  from '../services/post.service'
import { sendResponse } from '../utils/response'

export const searchPosts = async (req: Request, res: Response) => {
  try {
    const { title, content }  = req.query

    // Check for valid payload
    if (!(title || content)) {
      return sendResponse({
        res: res,
        message: 'Bad request: at least one parameter is required',
        statusCode: 400
      })
    }

    // Perform a case-insensitive search for posts containing the query in the title or content
    const posts = await Post.getPostsByQuery({ title: title as string, content: content as string})

    return sendResponse({
      res: res,
      data: posts,
      message: 'Posts fetched successfully',
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
