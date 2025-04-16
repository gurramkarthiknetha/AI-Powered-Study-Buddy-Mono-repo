import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], default: 'student' },
  preferences: {
    study_plan_type: { type: String, enum: ['structured', 'freeform'], default: 'structured' },
    study_times: { type: [String], default: [] },
    notification_enabled: { type: Boolean, default: true },
  },
  study_data: {
    total_study_time: { type: Number, default: 0 },
    total_progress: { type: Number, default: 0 },
    performance: {
      last_assessment_score: { type: Number, default: 0 },
      average_score: { type: Number, default: 0 },
    }
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
