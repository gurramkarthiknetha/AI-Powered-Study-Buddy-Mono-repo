import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/students.js';

const router = express.Router();

// Test endpoint to verify API is accessible
router.get('/test', (req, res) => {
  res.json({ message: 'Auth API is working', timestamp: new Date().toISOString() });
});

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role: 'student'
    });

    console.log('User created successfully:', { id: user._id, email: user.email });

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const responseData = {
      token,
      userId: user._id,
      name: user.name,
      email: user.email
    };

    console.log('Sending registration success response');
    res.status(201).json(responseData);
  } catch (error) {
    console.error('Registration error details:', error);

    // Provide more specific error messages based on the error type
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    res.status(500).json({
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('Missing required fields:', { email: !!email, password: !!password });
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.log('Password does not match for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User authenticated successfully:', { id: user._id, email: user.email });

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const responseData = {
      token,
      userId: user._id,
      name: user.name,
      email: user.email
    };

    console.log('Sending login success response');
    res.json(responseData);
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({
      message: 'Server error during login',
      error: error.message
    });
  }
});

export default router;