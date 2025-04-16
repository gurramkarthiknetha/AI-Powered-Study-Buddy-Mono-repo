import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  grade: { type: String, required: true },
  subjects: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);