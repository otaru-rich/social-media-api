import express from 'express';
import { searchPosts } from '../../controllers/search.controller';
import { authorize } from '../../middlewares/auth.middleware'
import { Role } from '../../types/type'

const router = express.Router();

router.get('/posts', authorize(Role.ADMIN, Role.USER), searchPosts);

export default router;
