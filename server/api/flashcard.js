import express from 'express';
import Flashcard from '../models/flashcard.js';

const router = express.Router();

const initializeCollection = async () => {
    const count = await Flashcard.countDocuments();
    if (count === 0) {
        await Flashcard.create({
            user_id: "507f1f77bcf86cd799439011",
            subject: "Mathematics",
            questions: [{
                question: "What is 2+2?",
                answer: "4",
                difficulty: "easy"
            }]
        });
        console.warn("========================================");
        console.info("Initialized flashcards collection with test data");
        console.warn("========================================");
    }
};

// Get all flashcards
router.get('/', async (req, res) => {
    try {
        await initializeCollection();
        const flashcards = await Flashcard.find();
        res.json(flashcards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's flashcards
router.get('/user/:userId', async (req, res) => {
    try {
        const flashcards = await Flashcard.find({ user_id: req.params.userId });
        res.json(flashcards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get flashcards by subject
router.get('/subject/:subject', async (req, res) => {
    try {
        const flashcards = await Flashcard.find({ subject: req.params.subject });
        res.json(flashcards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new flashcard set
router.post('/', async (req, res) => {
    try {
        const newFlashcard = await Flashcard.create(req.body);
        res.status(201).json(newFlashcard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update flashcard set
router.put('/:id', async (req, res) => {
    try {
        const updatedFlashcard = await Flashcard.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedFlashcard) return res.status(404).json({ message: 'Flashcard set not found' });
        res.json(updatedFlashcard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add question to flashcard set
router.post('/:id/questions', async (req, res) => {
    try {
        const flashcard = await Flashcard.findByIdAndUpdate(
            req.params.id,
            { $push: { questions: req.body } },
            { new: true }
        );
        if (!flashcard) return res.status(404).json({ message: 'Flashcard set not found' });
        res.json(flashcard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete flashcard set
router.delete('/:id', async (req, res) => {
    try {
        const deletedFlashcard = await Flashcard.findByIdAndDelete(req.params.id);
        if (!deletedFlashcard) return res.status(404).json({ message: 'Flashcard set not found' });
        res.json({ message: 'Flashcard set deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;