import {logger} from "../utils/logger";
const redis = require('redis');
import {Response} from "express";


export const initializeRedisClient = () => {
  logger.info('Initializing Redis');

  let client = redis.createClient();
  client.on('connect', () => {
    logger.info('Connected to Redis');
  });

  client.on('error', (error: any) => {
    logger.error('Redis Error:', error);
  });

  client.connect();
  return client;
};

export const redisClient = initializeRedisClient();


export const cacheResponse = (cacheKey: string, data: any, res: Response) => {
  if(!!data || data.length > 0){
    redisClient.setEx(cacheKey as any, 800 as any, JSON.stringify(data) as any)
        .then((response: any) => {
          console.log('Caching Response LOG:', response);
        })
        .catch((error: any) => {
          logger.error('Redis Cache Error:', error);
        });
  }
  return res;
};