import express from 'express'
import { authorize } from '../../middlewares/auth.middleware'
import { Role } from '../../types/type'
import { createPost, deletePost, getFollowingPosts, getUserPosts, updatePost } from '../../controllers/post.controller'
import { likePost, unlikePost } from '../../controllers/like.controller'
import { createComment, deleteComment, getComments } from '../../controllers/comment.controller'
import { searchPosts } from '../../controllers/search.controller'
import {checkCache} from '../../middlewares/redis.middleware'

const router = express.Router()

// Post CRUD
router.post('/', authorize(Role.ADMIN, Role.USER), createPost)
router.get('/following', authorize(Role.ADMIN, Role.USER), checkCache('following'), getFollowingPosts);
router.get('/', authorize(Role.ADMIN, Role.USER), checkCache('posts'), getUserPosts);
router.patch('/:postId', authorize(Role.ADMIN, Role.USER), updatePost)
router.delete('/:postId', authorize(Role.ADMIN, Role.USER), deletePost)

// Like CRUD
router.post('/:postId/like', authorize(Role.ADMIN, Role.USER), likePost)
router.delete('/:postId/unlike', authorize(Role.ADMIN, Role.USER), unlikePost)

// Comment CRUD
router.get('/:postId/comments', authorize(Role.ADMIN, Role.USER), checkCache('comments'), getComments)
router.post('/:postId/comments', authorize(Role.ADMIN, Role.USER), createComment)
router.delete('/:postId/comments/:commentId', authorize(Role.ADMIN, Role.USER), deleteComment)

// Search Route
router.get('/search', authorize(Role.ADMIN, Role.USER), checkCache('search_posts'), searchPosts);

export default router
