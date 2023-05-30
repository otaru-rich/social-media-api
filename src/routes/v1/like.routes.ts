import express from 'express'
import { likePost, unlikePost } from '../../controllers/like.controller'
import { authorize } from '../../middlewares/auth.middleware'
import { Role } from '../../types/type'

const router = express.Router()


router.post('/:postId', authorize(Role.ADMIN, Role.USER), likePost)
router.delete('/:postId', authorize(Role.ADMIN, Role.USER), unlikePost)

export default router
