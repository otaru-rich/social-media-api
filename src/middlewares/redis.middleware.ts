import { Request, Response, NextFunction } from 'express';
import { promisify } from 'util';

const redis = require('redis');
const redisClient = redis.createClient();

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (error: any) => {
  console.error('Redis Error:', error);
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.setEx).bind(redisClient);

export const checkCache = (req: Request, res: Response, next: NextFunction) => {
  const cacheKey = req.originalUrl;

  getAsync(cacheKey)
      .then((cachedData: string | null) => {
        if (cachedData) {
          const response = JSON.parse(cachedData);
          return res.json(response);
        } else {
          // Proceed to the next middleware if data is not cached
          next();
        }
      })
      .catch((error: any) => {
        console.error('Redis Cache Error:', error);
        // Proceed to the next middleware in case of an error
        next();
      });
};

// Middleware function to cache the response in Redis
export const cacheResponse = (req: Request, res: Response, next: NextFunction) => {
  const cacheKey = req.originalUrl;
  const responseData = res.locals.data;

    setAsync(cacheKey, 600, JSON.stringify(responseData)).then((response: any) => {
        console.log('Response cached:', response);
    }).catch((error: any) => {
        console.error('Redis Cache Error:', error);
    });

    next();
};