import {logger} from "../utils/logger";
import {redisClient} from "../services/caching.service";
import {Response, Request, NextFunction} from "express";

export const checkCache = (tag: string) => {

    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
    const { postId } = req.params;
    const { page, limit } = req.query
    const cacheKey = `${tag}:${postId}:${page}:${limit}`;

        await redisClient.get(cacheKey as any)
            .then((cachedData: any) => {
            console.log('Checking For cached response in Redis:', cachedData);
            if (cachedData) {
                const response = JSON.parse(cachedData);

                return res.json(response);
            }else{
                // Proceed to the next middleware in case of no cached data
                logger.info('Proceed to the next middleware in case of an error or no cached data');
                next();
            }
        }).catch((error: any) => {
            logger.error('Redis Cache Error:', error);
            // Proceed to the next middleware in case of an error
            next();
        });

}
};

