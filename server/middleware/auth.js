import User from '../models/User.js'
import { generateToken, verifyTokenMiddleware } from '../config/jwt.js'
import validator from 'validator'

// Validation helpers
const validateEmail = (email) => validator.isEmail(email)
const validatePassword = (password) => password && password.length >= 6

// Signup controller
export const signup = async (req, res) => {
  try {
    const { email, password, storeName, confirmPassword } = req.body

    // Validation
    if (!email || !password || !storeName) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      storeName: storeName.trim(),
    })

    // Generate token
    const token = generateToken(user._id, user.email)

    // Return user data (without password)
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        storeName: user.storeName,
      },
      token,
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ message: error.message || 'Signup failed' })
  }
}

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user and include password field for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Compare passwords
    const isPasswordCorrect = await user.matchPassword(password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate token
    const token = generateToken(user._id, user.email)

    res.json({
      user: {
        id: user._id,
        email: user.email,
        storeName: user.storeName,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: error.message || 'Login failed' })
  }
}

// Verify token middleware
export const verifyToken = verifyTokenMiddleware
