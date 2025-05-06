import express from 'express';
import Profile from '../models/profile.js';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { upload, cloudinary } from '../config/cloudinary.js';

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

// Upload profile image
router.post('/upload-image', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Get the current profile
    let profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      profile = await Profile.create({ userId: req.userId });
    }

    // If there's an existing image, delete it from Cloudinary
    if (profile.profileImage && profile.profileImage.publicId) {
      await cloudinary.uploader.destroy(profile.profileImage.publicId);
    }

    // Update profile with new image info
    profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      {
        profileImage: {
          url: req.file.path,
          publicId: req.file.filename
        },
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      profileImage: profile.profileImage
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ message: 'Error uploading profile image' });
  }
});

// Delete profile image
router.delete('/image', requireAuth, async (req, res) => {
  try {
    // Get the current profile
    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile || !profile.profileImage || !profile.profileImage.publicId) {
      return res.status(404).json({ message: 'No profile image found' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(profile.profileImage.publicId);

    // Update profile to remove image reference
    await Profile.findOneAndUpdate(
      { userId: req.userId },
      {
        profileImage: {
          url: '',
          publicId: ''
        },
        updatedAt: new Date()
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting profile image:', error);
    res.status(500).json({ message: 'Error deleting profile image' });
  }
});

// Update profile preferences
router.put('/preferences', requireAuth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      {
        'preferences': req.body,
        updatedAt: new Date()
      },
      { new: true }
    );
    res.json(profile);
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Error updating preferences' });
  }
});

export default router;