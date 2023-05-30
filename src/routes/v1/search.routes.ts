import express from 'express';
import { searchPosts } from '../../controllers/search.controller';

const router = express.Router();

router.get('/posts', searchPosts);

export default router;
