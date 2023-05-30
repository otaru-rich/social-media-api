import express from 'express'
import { followUser, unfollowUser } from '../../controllers/follow.controller'
import { authorize } from '../../middlewares/auth.middleware'
import { Role } from '../../types/type'

const router = express.Router()

router.post('/:followId', authorize(Role.ADMIN, Role.USER), followUser)
router.delete('/:followId', authorize(Role.ADMIN, Role.USER), unfollowUser)

export default router;
