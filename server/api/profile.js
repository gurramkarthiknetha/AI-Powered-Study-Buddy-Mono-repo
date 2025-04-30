import express from 'express';
import Profile from '../models/profile.js';
import { clerkClient } from '@clerk/clerk-sdk-node';

const router = express.Router();

// Middleware to verify Clerk token
const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const client = await clerkClient.sessions.verifySession(token);
    req.userId = client.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get profile
router.get('/', requireAuth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      profile = await Profile.create({ userId: req.userId });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update profile
router.put('/', requireAuth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      { ...req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Add achievement
router.post('/achievements', requireAuth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      { $push: { achievements: req.body } },
      { new: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error adding achievement' });
  }
});

// Delete achievement
router.delete('/achievements/:id', requireAuth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      { $pull: { achievements: { _id: req.params.id } } },
      { new: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting achievement' });
  }
});

export default router;