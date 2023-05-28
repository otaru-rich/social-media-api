import express from 'express'
import { loginUser, registerUser } from '../../controllers/user.controller'
import { authorize } from '../../middlewares/auth.middleware'
import { Role } from '../../types/type'

const router = express.Router()

router.post('/register', authorize([Role.GUEST]), registerUser)
router.post('/login', loginUser)

export default router
