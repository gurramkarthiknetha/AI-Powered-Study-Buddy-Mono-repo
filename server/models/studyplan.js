import mongoose from 'mongoose';

const studyPlanSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan_title: { type: String, required: true },
  subjects: [{
    subject_name: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    study_sessions: [{
      session_date: { type: Date, required: true },
      topics_covered: { type: [String], required: true },
      duration_minutes: { type: Number, required: true }
    }]
  }],
}, { timestamps: true });

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
export default StudyPlan;
