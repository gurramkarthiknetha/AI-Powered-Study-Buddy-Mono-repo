import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  bio: {
    type: String,
    maxLength: 500
  },
  educationLevel: {
    type: String,
    enum: ['high_school', 'bachelors', 'masters', 'phd']
  },
  subjects: [{
    type: String
  }],
  learningGoals: [{
    type: String
  }],
  preferredLearningStyle: {
    type: String,
    enum: ['visual', 'auditory', 'reading', 'kinesthetic']
  },
  studySchedule: {
    preferredTime: String,
    weeklyHours: Number
  },
  achievements: [{
    title: String,
    date: Date,
    description: String
  }],
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

profileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;