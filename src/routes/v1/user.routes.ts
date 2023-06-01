import express from 'express'
import { loginUser, registerUser } from '../../controllers/user.controller'
import { authorize } from '../../middlewares/auth.middleware'
import { Role } from '../../types/type'
import { followUser, unfollowUser } from '../../controllers/follow.controller'

const router = express.Router()

// Authentication routes
router.post('/register', authorize(Role.GUEST), registerUser)
router.post('/login', loginUser)

// Follower routes
router.post('/:followId/follow', authorize(Role.ADMIN, Role.USER), followUser)
router.delete('/:followId/unfollow', authorize(Role.ADMIN, Role.USER), unfollowUser)

export default router
