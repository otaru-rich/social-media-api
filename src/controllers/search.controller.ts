import { Request, Response } from 'express'
import * as PostService  from '../services/post.service'
import {cacheResponse} from "../services/caching.service";
import {ServerError, ServerErrorHandler} from "../utils/errorHandler";

export const searchPosts = async (req: Request, res: Response) => {
  try {
    const { userId }  = req.body.verified;
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
    const posts = await PostService.getPostsByQuery(userId,{
      keyword: keyword as string,
      tags: tags as string
      }, pageNumber, postLimit)

    res.status(200).json({
      message: 'Fetched posts successfully',
      data: posts
    });
    const cacheKey =`posts:${keyword}:${tags}:${page}:${limit}`;
    return cacheResponse(cacheKey,posts,res);
  } catch (error) {
    console.error(error)
    return ServerErrorHandler(new ServerError('Internal Server Error'), req, res);
  }
}
