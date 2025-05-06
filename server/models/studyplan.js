import mongoose from 'mongoose';

const studyPlanSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan_title: { type: String, required: true },
  description: { type: String },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  goal_type: {
    type: String,
    enum: ['time-based', 'topic-based', 'milestone-based'],
    required: true
  },
  overall_progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  calendar_integrated: { type: Boolean, default: false },
  calendar_id: { type: String },
  subjects: [{
    subject_name: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    color: { type: String, default: '#4a90e2' },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    topics: [{
      name: { type: String, required: true },
      completed: { type: Boolean, default: false },
      priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
    }],
    study_sessions: [{
      title: { type: String, required: true },
      session_date: { type: Date, required: true },
      start_time: { type: String, required: true },
      end_time: { type: String, required: true },
      topics_covered: { type: [String] },
      duration_minutes: { type: Number, required: true },
      completed: { type: Boolean, default: false },
      actual_duration_minutes: { type: Number },
      notes: { type: String },
      recurring: { type: Boolean, default: false },
      recurrence_pattern: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'none'],
        default: 'none'
      },
      recurrence_end_date: { type: Date }
    }]
  }],
  reminders: [{
    title: { type: String, required: true },
    message: { type: String },
    reminder_date: { type: Date, required: true },
    reminder_time: { type: String, required: true },
    sent: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['email', 'push', 'in-app'],
      default: 'in-app'
    }
  }],
  milestones: [{
    title: { type: String, required: true },
    description: { type: String },
    due_date: { type: Date, required: true },
    completed: { type: Boolean, default: false }
  }]
}, { timestamps: true });

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
export default StudyPlan;
