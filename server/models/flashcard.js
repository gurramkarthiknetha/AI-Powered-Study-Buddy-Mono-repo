import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    answer: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
  }],
}, { timestamps: true });

const Flashcard = mongoose.model('Flashcard', flashcardSchema);
export default Flashcard;
