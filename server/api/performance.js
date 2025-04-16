import express from 'express';
import Performance from '../models/performance.js';

const router = express.Router();

const initializeCollection = async () => {
    const count = await Performance.countDocuments();
    if (count === 0) {
        await Performance.create({
            user_id: "507f1f77bcf86cd799439011",
            quiz_id: "quiz123",
            score: 85,
            total_questions: 10,
            correct_answers: 8,
            incorrect_answers: 2,
            quiz_duration: 15
        });
        console.warn("========================================");
        console.info("Initialized performance collection with test data");
        console.warn("========================================");
    }
};

// Get all performance records
router.get('/', async (req, res) => {
    try {
        await initializeCollection();
        const records = await Performance.find();
        
        // Format the data for frontend charts
        const formattedData = {
            studyTime: [
                { subject: "Mathematics", value: 30 },
                { subject: "Science", value: 25 },
                { subject: "English", value: 20 },
                { subject: "History", value: 15 }
            ],
            subjectProgress: [
                { subject: "Mathematics", progress: 85 },
                { subject: "Science", progress: 70 },
                { subject: "English", progress: 90 },
                { subject: "History", progress: 65 }
            ],
            weeklyActivity: [
                { day: "Mon", hours: 4 },
                { day: "Tue", hours: 3 },
                { day: "Wed", hours: 5 },
                { day: "Thu", hours: 2 },
                { day: "Fri", hours: 4 },
                { day: "Sat", hours: 6 },
                { day: "Sun", hours: 3 }
            ],
            achievements: [
                {
                    icon: "🏆",
                    title: "Study Streak",
                    description: "Completed 5 days streak",
                    date: new Date()
                },
                {
                    icon: "⭐",
                    title: "Perfect Score",
                    description: "Scored 100% in Mathematics quiz",
                    date: new Date()
                }
            ]
        };

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's performance records
router.get('/user/:userId', async (req, res) => {
    try {
        const records = await Performance.find({ user_id: req.params.userId });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new performance record
router.post('/', async (req, res) => {
    try {
        const newRecord = await Performance.create(req.body);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update performance record
router.put('/:id', async (req, res) => {
    try {
        const updatedRecord = await Performance.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedRecord) return res.status(404).json({ message: 'Record not found' });
        res.json(updatedRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete performance record
router.delete('/:id', async (req, res) => {
    try {
        const deletedRecord = await Performance.findByIdAndDelete(req.params.id);
        if (!deletedRecord) return res.status(404).json({ message: 'Record not found' });
        res.json({ message: 'Performance record deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;