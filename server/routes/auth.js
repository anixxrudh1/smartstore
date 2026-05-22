import express from 'express'
import { signup, login, verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/verify', verifyToken, (req, res) => {
  res.json({ user: req.user })
})

export default router
