import express from 'express'
import { followUser, unfollowUser } from '../../controllers/follow.controller'

const router = express.Router()

router.post('/:followId', followUser)
router.delete('/:followId', unfollowUser)

export default router;
