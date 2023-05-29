import express from 'express'
import { likePost, unlikePost } from '../../controllers/like.controller'

const router = express.Router()


router.post('/:postId', likePost)
router.delete('/:postId', unlikePost)

export default router
