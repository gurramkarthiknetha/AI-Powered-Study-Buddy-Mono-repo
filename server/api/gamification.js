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
            rewards: ["Welcome Bonus"],
            userProgress: {
                level: 5,
                experience: 2340,
                nextLevelXP: 3000,
                totalPoints: 4580,
                streak: 7
            },
            achievements: [
                {
                    id: 1,
                    title: "First Steps",
                    description: "Complete your first study session",
                    icon: "🎯",
                    progress: 100,
                    completed: true,
                    reward: 100
                },
                {
                    id: 2,
                    title: "Week Warrior",
                    description: "Maintain a 7-day study streak",
                    icon: "🔥",
                    progress: 100,
                    completed: true,
                    reward: 250
                },
                {
                    id: 3,
                    title: "Knowledge Seeker",
                    description: "Create 10 study notes",
                    icon: "📚",
                    progress: 70,
                    completed: false,
                    reward: 300
                },
                {
                    id: 4,
                    title: "Quiz Master",
                    description: "Score 100% in 5 quizzes",
                    icon: "🎓",
                    progress: 60,
                    completed: false,
                    reward: 500
                }
            ],
            leaderboard: [
                { id: 1, name: "Alex", points: 5200, rank: 1 },
                { id: 2, name: "Sarah", points: 4800, rank: 2 },
                { id: 3, name: "You", points: 4580, rank: 3 },
                { id: 4, name: "Mike", points: 4200, rank: 4 },
                { id: 5, name: "Emma", points: 3900, rank: 5 }
            ],
            studyStats: {
                totalStudyTime: "42h 30m",
                sessionsCompleted: 28,
                averageScore: 85,
                topSubject: "Mathematics"
            }
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
        let record = await Gamification.findOne({ user_id: req.params.userId });

        // If no record exists for this user, create one with default values
        if (!record) {
            record = await Gamification.create({
                user_id: req.params.userId,
                userProgress: {
                    level: 1,
                    experience: 0,
                    nextLevelXP: 1000,
                    totalPoints: 0,
                    streak: 0
                },
                achievements: [
                    {
                        id: 1,
                        title: "First Steps",
                        description: "Complete your first study session",
                        icon: "🎯",
                        progress: 0,
                        completed: false,
                        reward: 100
                    },
                    {
                        id: 2,
                        title: "Week Warrior",
                        description: "Maintain a 7-day study streak",
                        icon: "🔥",
                        progress: 0,
                        completed: false,
                        reward: 250
                    },
                    {
                        id: 3,
                        title: "Knowledge Seeker",
                        description: "Create 10 study notes",
                        icon: "📚",
                        progress: 0,
                        completed: false,
                        reward: 300
                    },
                    {
                        id: 4,
                        title: "Quiz Master",
                        description: "Score 100% in 5 quizzes",
                        icon: "🎓",
                        progress: 0,
                        completed: false,
                        reward: 500
                    }
                ],
                leaderboard: [
                    { id: 1, name: "Alex", points: 5200, rank: 1 },
                    { id: 2, name: "Sarah", points: 4800, rank: 2 },
                    { id: 3, name: "You", points: 0, rank: 3 },
                    { id: 4, name: "Mike", points: 4200, rank: 4 },
                    { id: 5, name: "Emma", points: 3900, rank: 5 }
                ],
                studyStats: {
                    totalStudyTime: "0h 0m",
                    sessionsCompleted: 0,
                    averageScore: 0,
                    topSubject: ""
                }
            });
            console.log(`Created new gamification record for user ${req.params.userId}`);
        }

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

// Update user progress
router.patch('/:userId/progress', async (req, res) => {
    try {
        const record = await Gamification.findOneAndUpdate(
            { user_id: req.params.userId },
            { $set: { userProgress: req.body } },
            { new: true }
        );
        if (!record) return res.status(404).json({ message: 'Record not found' });

        // Emit socket event for real-time updates
        const io = req.app.get('io');
        if (io) {
            io.to(req.params.userId).emit('gamification_updated', {
                type: 'progress',
                data: record
            });
        }

        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update achievements
router.patch('/:userId/achievements', async (req, res) => {
    try {
        const record = await Gamification.findOneAndUpdate(
            { user_id: req.params.userId },
            { $set: { achievements: req.body } },
            { new: true }
        );
        if (!record) return res.status(404).json({ message: 'Record not found' });

        // Emit socket event for real-time updates
        const io = req.app.get('io');
        if (io) {
            io.to(req.params.userId).emit('gamification_updated', {
                type: 'achievements',
                data: record
            });
        }

        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a single achievement
router.patch('/:userId/achievements/:achievementId', async (req, res) => {
    try {
        const record = await Gamification.findOne({ user_id: req.params.userId });
        if (!record) return res.status(404).json({ message: 'Record not found' });

        const achievementIndex = record.achievements.findIndex(a => a.id === parseInt(req.params.achievementId));
        if (achievementIndex === -1) return res.status(404).json({ message: 'Achievement not found' });

        record.achievements[achievementIndex] = {
            ...record.achievements[achievementIndex].toObject(),
            ...req.body
        };

        await record.save();

        // Emit socket event for real-time updates
        const io = req.app.get('io');
        if (io) {
            io.to(req.params.userId).emit('gamification_updated', {
                type: 'achievement',
                achievementId: parseInt(req.params.achievementId),
                data: record
            });

            // If achievement is completed, send a special notification
            if (req.body.completed === true) {
                io.to(req.params.userId).emit('achievement_unlocked', {
                    achievement: record.achievements[achievementIndex]
                });
            }
        }

        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update study stats
router.patch('/:userId/stats', async (req, res) => {
    try {
        const record = await Gamification.findOneAndUpdate(
            { user_id: req.params.userId },
            { $set: { studyStats: req.body } },
            { new: true }
        );
        if (!record) return res.status(404).json({ message: 'Record not found' });

        // Emit socket event for real-time updates
        const io = req.app.get('io');
        if (io) {
            io.to(req.params.userId).emit('gamification_updated', {
                type: 'stats',
                data: record
            });
        }

        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;