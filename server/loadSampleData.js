import { connectToDB, mongoose } from './db.js';
import dotenv from 'dotenv';
import { sampleData } from './sampleData.js';

// Import all models
import Student from './models/students.js';
import StudyPlan from './models/studyplan.js';
import PomodoroTimer from './models/pomodoroTimer.js';
import Performance from './models/performance.js';
import Gamification from './models/gamification.js';
import Flashcard from './models/flashcard.js';
import ChatbotInteraction from './models/chatbotInteraction.js';
import Profile from './models/profile.js';

// Load environment variables
dotenv.config();

async function loadSampleData() {
  try {
    // Connect to the database
    await connectToDB();
    console.log('Connected to MongoDB');

    // Check if data already exists in collections
    const studentCount = await Student.countDocuments();
    const studyPlanCount = await StudyPlan.countDocuments();
    const pomodoroCount = await PomodoroTimer.countDocuments();
    const performanceCount = await Performance.countDocuments();
    const gamificationCount = await Gamification.countDocuments();
    const flashcardCount = await Flashcard.countDocuments();
    const chatbotCount = await ChatbotInteraction.countDocuments();
    const profileCount = await Profile.countDocuments();

    // Only load data if collections are empty
    if (studentCount === 0) {
      console.log('Loading sample students data...');
      await Student.insertMany(sampleData.students);
      console.log('✅ Sample students data loaded successfully');
    } else {
      console.log('Students collection already has data. Skipping...');
    }

    if (studyPlanCount === 0) {
      console.log('Loading sample study plans data...');
      await StudyPlan.insertMany(sampleData.studyPlans);
      console.log('✅ Sample study plans data loaded successfully');
    } else {
      console.log('Study plans collection already has data. Skipping...');
    }

    if (pomodoroCount === 0) {
      console.log('Loading sample pomodoro timers data...');
      await PomodoroTimer.insertMany(sampleData.pomodoroTimers);
      console.log('✅ Sample pomodoro timers data loaded successfully');
    } else {
      console.log('Pomodoro timers collection already has data. Skipping...');
    }

    if (performanceCount === 0) {
      console.log('Loading sample performance data...');
      await Performance.insertMany(sampleData.performances);
      console.log('✅ Sample performance data loaded successfully');
    } else {
      console.log('Performance collection already has data. Skipping...');
    }

    if (gamificationCount === 0) {
      console.log('Loading sample gamification data...');
      await Gamification.insertMany(sampleData.gamifications);
      console.log('✅ Sample gamification data loaded successfully');
    } else {
      console.log('Gamification collection already has data. Skipping...');
    }

    if (flashcardCount === 0) {
      console.log('Loading sample flashcards data...');
      await Flashcard.insertMany(sampleData.flashcards);
      console.log('✅ Sample flashcards data loaded successfully');
    } else {
      console.log('Flashcards collection already has data. Skipping...');
    }

    if (chatbotCount === 0) {
      console.log('Loading sample chatbot interactions data...');
      await ChatbotInteraction.insertMany(sampleData.chatbotInteractions);
      console.log('✅ Sample chatbot interactions data loaded successfully');
    } else {
      console.log('Chatbot interactions collection already has data. Skipping...');
    }

    if (profileCount === 0) {
      console.log('Loading sample profiles data...');
      await Profile.insertMany(sampleData.profiles);
      console.log('✅ Sample profiles data loaded successfully');
    } else {
      console.log('Profiles collection already has data. Skipping...');
    }

    console.log('🎉 All sample data loaded successfully!');

  } catch (error) {
    console.error('❌ Error loading sample data:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the function
loadSampleData();
