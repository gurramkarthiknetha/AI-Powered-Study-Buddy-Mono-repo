import mongoose from 'mongoose';

const gamificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Beginner' },
  rewards: { type: [String], default: [] },
}, { timestamps: true });

const Gamification = mongoose.model('Gamification', gamificationSchema);
export default Gamification;
