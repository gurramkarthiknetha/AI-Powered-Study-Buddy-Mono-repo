import express from 'express';
import Theme from '../models/themes.js';

const router = express.Router();

const initializeCollection = async () => {
    const count = await Theme.countDocuments();
    if (count === 0) {
        await Theme.create({
            name: "Default Theme",
            primaryColor: "#007bff",
            secondaryColor: "#6c757d",
            backgroundColor: "#ffffff",
            textColor: "#000000"
        });
        console.warn("========================================");
        console.info("Initialized themes collection with default data");
        console.warn("========================================");
    } else {
        console.info("Themes collection already contains data");
    }
};

// Get all themes
router.get('/', async (req, res) => {
    try {
        await initializeCollection();
        const themes = await Theme.find();
        res.json(themes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ...existing code...

export default router;