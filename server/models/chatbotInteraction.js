import mongoose from 'mongoose';

const chatbotInteractionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interaction_type: { type: String, enum: ['question', 'explanation'], required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  resolved: { type: Boolean, default: true },
}, { timestamps: true });

const ChatbotInteraction = mongoose.model('ChatbotInteraction', chatbotInteractionSchema);
export default ChatbotInteraction;
