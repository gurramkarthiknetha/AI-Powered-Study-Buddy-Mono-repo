import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/students.js';

const router = express.Router();

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        avatar: profile.photos?.[0]?.value || '',
        role: 'student'
      });
    } else if (!user.googleId) {
      user.googleId = profile.id;
      if (!user.avatar && profile.photos?.[0]?.value) {
        user.avatar = profile.photos[0].value;
      }
      await user.save();
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3223'}/login?error=auth_failed`
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3223';
    res.redirect(
      `${clientUrl}/auth/callback?token=${token}&userId=${user._id}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&avatar=${encodeURIComponent(user.avatar || '')}`
    );
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) console.error('Logout error:', err);
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user from JWT
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password_hash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ userId: user._id, name: user.name, email: user.email, avatar: user.avatar });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
