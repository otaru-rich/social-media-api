import express from 'express'
import { createPost, getUserPosts, deletePost} from '../../controllers/post.controller'

const router = express.Router()

router.get('/:userId', getUserPosts)
router.post('/create', createPost)
router.delete('/:postId', deletePost)

export default router
