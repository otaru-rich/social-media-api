import { Request, Response } from 'express'
import * as PostService  from '../services/post.service'

export const searchPosts = async (req: Request, res: Response) => {
  try {
    const { keyword, tags, page, limit }  = req.query

    // Check for valid payload
    if (!(keyword || tags)) {
      return res.status(400).json({
        message: 'Bad request'
      });
    }

    // Perform a case-insensitive search for posts containing the query in the title or content
    const pageNumber = Number.parseInt(page as string, 10) || 1
    const postLimit = Number.parseInt(limit as string, 10) || 10
    const posts = await PostService.getPostsByQuery({
      keyword: keyword as string,
      tags: tags as string
    })

    res.locals.data = posts
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
