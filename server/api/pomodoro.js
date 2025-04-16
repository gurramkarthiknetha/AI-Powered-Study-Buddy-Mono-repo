import express from 'express';
import PomodoroTimer from '../models/pomodoroTimer.js';

const router = express.Router();

const initializeCollection = async () => {
    const count = await PomodoroTimer.countDocuments();
    if (count === 0) {
        await PomodoroTimer.create({
            user_id: "507f1f77bcf86cd799439011",
            start_time: new Date(),
            end_time: new Date(Date.now() + 25 * 60 * 1000),
            session_duration: 25,
            distractions_blocked: ["facebook.com", "twitter.com"]
        });
        console.warn("========================================");
        console.info("Initialized pomodoro collection with test data");
        console.warn("========================================");
    }
};

// Get all pomodoro sessions
router.get('/', async (req, res) => {
    try {
        await initializeCollection();
        const sessions = await PomodoroTimer.find();
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's pomodoro sessions
router.get('/user/:userId', async (req, res) => {
    try {
        const sessions = await PomodoroTimer.find({ user_id: req.params.userId });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start new pomodoro session
router.post('/', async (req, res) => {
    try {
        const newSession = await PomodoroTimer.create(req.body);
        res.status(201).json(newSession);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update pomodoro session
router.put('/:id', async (req, res) => {
    try {
        const updatedSession = await PomodoroTimer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedSession) return res.status(404).json({ message: 'Session not found' });
        res.json(updatedSession);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete pomodoro session
router.delete('/:id', async (req, res) => {
    try {
        const deletedSession = await PomodoroTimer.findByIdAndDelete(req.params.id);
        if (!deletedSession) return res.status(404).json({ message: 'Session not found' });
        res.json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;