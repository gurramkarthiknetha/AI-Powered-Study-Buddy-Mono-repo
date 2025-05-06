import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  profileImage: {
    url: {
      type: String,
      default: ""
    },
    publicId: {
      type: String,
      default: ""
    }
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
    weeklyHours: Number,
    preferredDays: [String],
    reminderEnabled: {
      type: Boolean,
      default: false
    },
    reminderTime: String
  },
  achievements: [{
    title: String,
    date: Date,
    description: String
  }],
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    instagram: String,
    website: String
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    accentColor: {
      type: String,
      default: '#4a6cf7'
    },
    notifications: {
      studyReminders: {
        type: Boolean,
        default: true
      },
      achievements: {
        type: Boolean,
        default: true
      },
      messages: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      showProfileToOthers: {
        type: Boolean,
        default: true
      },
      showProgressToOthers: {
        type: Boolean,
        default: true
      },
      showAchievementsToOthers: {
        type: Boolean,
        default: true
      }
    }
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