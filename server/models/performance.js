import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz_id: { type: String, required: true },
  score: { type: Number, required: true },
  total_questions: { type: Number, required: true },
  correct_answers: { type: Number, required: true },
  incorrect_answers: { type: Number, required: true },
  quiz_duration: { type: Number, required: true },  // in minutes
}, { timestamps: true });

const Performance = mongoose.model('Performance', performanceSchema);
export default Performance;
