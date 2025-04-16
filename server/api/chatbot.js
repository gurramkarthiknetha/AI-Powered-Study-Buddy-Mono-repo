import express from 'express';
import ChatbotInteraction from '../models/chatbotInteraction.js';

const router = express.Router();

const initializeCollection = async () => {
    const count = await ChatbotInteraction.countDocuments();
    if (count === 0) {
        await ChatbotInteraction.create({
            user_id: "507f1f77bcf86cd799439011",
            interaction_type: "question",
            question: "What is the capital of France?",
            answer: "The capital of France is Paris.",
            resolved: true
        });
        console.warn("========================================");
        console.info("Initialized chatbot interactions collection with test data");
        console.warn("========================================");
    }
};

// Get all interactions
router.get('/', async (req, res) => {
    try {
        await initializeCollection();
        const interactions = await ChatbotInteraction.find();
        res.json(interactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's interactions
router.get('/user/:userId', async (req, res) => {
    try {
        const interactions = await ChatbotInteraction.find({ user_id: req.params.userId });
        res.json(interactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new interaction
router.post('/', async (req, res) => {
    try {
        const newInteraction = await ChatbotInteraction.create(req.body);
        res.status(201).json(newInteraction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update interaction
router.put('/:id', async (req, res) => {
    try {
        const updatedInteraction = await ChatbotInteraction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedInteraction) return res.status(404).json({ message: 'Interaction not found' });
        res.json(updatedInteraction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete interaction
router.delete('/:id', async (req, res) => {
    try {
        const deletedInteraction = await ChatbotInteraction.findByIdAndDelete(req.params.id);
        if (!deletedInteraction) return res.status(404).json({ message: 'Interaction not found' });
        res.json({ message: 'Interaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;