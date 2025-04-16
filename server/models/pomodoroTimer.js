import mongoose from 'mongoose';

const pomodoroTimerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  session_duration: { type: Number, required: true },  // in minutes
  distractions_blocked: { type: [String], required: true },  // apps/websites blocked
}, { timestamps: true });

const PomodoroTimer = mongoose.model('PomodoroTimer', pomodoroTimerSchema);
export default PomodoroTimer;
