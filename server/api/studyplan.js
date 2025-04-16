import express from 'express';
import StudyPlan from '../models/studyplan.js';

const router = express.Router();

const initializeCollection = async () => {
    const count = await StudyPlan.countDocuments();
    if (count === 0) {
        await StudyPlan.create({
            user_id: "507f1f77bcf86cd799439011",
            plan_title: "Sample Study Plan",
            subjects: [{
                subject_name: "Mathematics",
                start_date: new Date(),
                end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                study_sessions: [{
                    session_date: new Date(),
                    topics_covered: ["Algebra Basics"],
                    duration_minutes: 60
                }]
            }]
        });
        console.warn("========================================");
        console.info("Initialized study plans collection with test data");
        console.warn("========================================");
    }
};

// Get all study plans
router.get('/', async (req, res) => {
    try {
        await initializeCollection();
        const plans = await StudyPlan.find();
        res.json(plans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get study plan by ID
router.get('/:id', async (req, res) => {
    try {
        const plan = await StudyPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Study plan not found' });
        res.json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new study plan
router.post('/', async (req, res) => {
    try {
        const newPlan = await StudyPlan.create(req.body);
        res.status(201).json(newPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update study plan
router.put('/:id', async (req, res) => {
    try {
        const updatedPlan = await StudyPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedPlan) return res.status(404).json({ message: 'Study plan not found' });
        res.json(updatedPlan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete study plan
router.delete('/:id', async (req, res) => {
    try {
        const deletedPlan = await StudyPlan.findByIdAndDelete(req.params.id);
        if (!deletedPlan) return res.status(404).json({ message: 'Study plan not found' });
        res.json({ message: 'Study plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;