import express from 'express'
import { createComment, deleteComment } from '../../controllers/comment.controller'
import { authorize } from '../../middlewares/auth.middleware'
import { Role } from '../../types/type'

const router = express.Router()

router.post('/:postId', authorize(Role.ADMIN, Role.USER), createComment)
router.delete('/:commentId', authorize(Role.ADMIN, Role.USER), deleteComment)

export default router
