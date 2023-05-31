import express from 'express'
import { authorize } from '../../middlewares/auth.middleware'
import { Role } from '../../types/type'
import { createPost, deletePost, getFollowingPosts, getUserPosts, updatePost } from '../../controllers/post.controller'
import { likePost, unlikePost } from '../../controllers/like.controller'

const router = express.Router()

router.post('/', authorize(Role.ADMIN, Role.USER), createPost)
router.get('/following', authorize(Role.ADMIN, Role.USER), getFollowingPosts);
router.get('/', authorize(Role.ADMIN, Role.USER), getUserPosts)
router.patch('/:postId', authorize(Role.ADMIN, Role.USER), updatePost)
router.delete('/:postId', authorize(Role.ADMIN, Role.USER), deletePost)
router.post('/:postId/like', authorize(Role.ADMIN, Role.USER), likePost)
router.delete('/:postId/like', authorize(Role.ADMIN, Role.USER), unlikePost)

export default router
