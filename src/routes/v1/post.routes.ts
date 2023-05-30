import express from 'express'
import { authorize } from '../../middlewares/auth.middleware'
import { Role } from '../../types/type'
import { createPost, deletePost, getFollowingPosts, getUserPosts, updatePost } from '../../controllers/post.controller'

const router = express.Router()

router.post('/', authorize(Role.ADMIN, Role.USER), createPost)
router.get('/following', authorize(Role.ADMIN, Role.USER), getFollowingPosts);
router.get('/:userId', authorize(Role.ADMIN, Role.USER), getUserPosts)
router.patch('/:postId', authorize(Role.ADMIN, Role.USER), updatePost)
router.delete('/:postId', authorize(Role.ADMIN, Role.USER), deletePost)

export default router
