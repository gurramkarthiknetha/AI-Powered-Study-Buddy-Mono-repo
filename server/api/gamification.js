import express from 'express';
import Gamification from '../models/gamification.js';

const router = express.Router();

const initializeCollection = async () => {
    const count = await Gamification.countDocuments();
    if (count === 0) {
        await Gamification.create({
            user_id: "507f1f77bcf86cd799439011", // Dummy ObjectId
            points: 100,
            badges: ["Starter"],
            level: "Beginner",
            rewards: ["Welcome Bonus"]
        });
        console.warn("========================================");
        console.info("Initialized gamification collection with test data");
        console.warn("========================================");
    }
};

// Get all gamification records
router.get('/', async (req, res) => {
    try {
        await initializeCollection();
        const records = await Gamification.find();
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's gamification record
router.get('/user/:userId', async (req, res) => {
    try {
        const record = await Gamification.findOne({ user_id: req.params.userId });
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create or update gamification record
router.post('/', async (req, res) => {
    try {
        const record = await Gamification.findOneAndUpdate(
            { user_id: req.body.user_id },
            req.body,
            { new: true, upsert: true }
        );
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update points
router.patch('/:userId/points', async (req, res) => {
    try {
        const record = await Gamification.findOneAndUpdate(
            { user_id: req.params.userId },
            { $inc: { points: req.body.points } },
            { new: true }
        );
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add badge
router.patch('/:userId/badges', async (req, res) => {
    try {
        const record = await Gamification.findOneAndUpdate(
            { user_id: req.params.userId },
            { $addToSet: { badges: req.body.badge } },
            { new: true }
        );
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;