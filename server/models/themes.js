import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    primaryColor: { type: String, required: true },
    secondaryColor: { type: String, required: true },
    backgroundColor: { type: String, required: true },
    textColor: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Theme', themeSchema);