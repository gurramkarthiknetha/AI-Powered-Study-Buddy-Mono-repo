import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  reward: { type: Number, required: true }
});

const leaderboardEntrySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  points: { type: Number, required: true },
  rank: { type: Number, required: true }
});

const studyStatsSchema = new mongoose.Schema({
  totalStudyTime: { type: String, default: "0h 0m" },
  sessionsCompleted: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  topSubject: { type: String, default: "" }
});

const userProgressSchema = new mongoose.Schema({
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  nextLevelXP: { type: Number, default: 1000 },
  totalPoints: { type: Number, default: 0 },
  streak: { type: Number, default: 0 }
});

const gamificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userProgress: { type: userProgressSchema, default: () => ({}) },
  achievements: { type: [achievementSchema], default: [] },
  leaderboard: { type: [leaderboardEntrySchema], default: [] },
  studyStats: { type: studyStatsSchema, default: () => ({}) },
  // Keep original fields for backward compatibility
  points: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Beginner' },
  rewards: { type: [String], default: [] },
}, { timestamps: true });

const Gamification = mongoose.model('Gamification', gamificationSchema);
export default Gamification;
