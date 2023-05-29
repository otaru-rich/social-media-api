import express from 'express'
import { getUserPosts, createPost, updatePost, deletePost} from '../../controllers/post.controller'

const router = express.Router()

router.get('/:userId', getUserPosts)
router.post('/create', createPost)
router.patch('/:postId', updatePost)
router.delete('/:postId', deletePost)

export default router
