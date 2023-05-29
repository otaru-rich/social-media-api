import express from 'express'
import { getUserPosts, createPost, updatePost, deletePost} from '../../controllers/post.controller'

const router = express.Router()

router.post('/', createPost)
router.get('/:userId', getUserPosts)
router.patch('/:postId', updatePost)
router.delete('/:postId', deletePost)

export default router
