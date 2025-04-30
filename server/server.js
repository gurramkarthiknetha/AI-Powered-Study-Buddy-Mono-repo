import express from 'express';
import cors from 'cors';
import { connectToDB, mongoose } from './db.js';
import dotenv from 'dotenv';
import studentsRouter from './api/students.js';
import studyPlanRouter from './api/studyplan.js';
import pomodoroRouter from './api/pomodoro.js';
import performanceRouter from './api/performance.js';
import gamificationRouter from './api/gamification.js';
import flashcardRouter from './api/flashcard.js';
import chatbotRouter from './api/chatbot.js';
import authRouter from './api/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.send('AI Study Buddy API is running');
});

// Mount the routers
app.use('/api/auth', authRouter);
app.use('/api/students', studentsRouter);
app.use('/api/study-plans', studyPlanRouter);
app.use('/api/pomodoro', pomodoroRouter);
app.use('/api/performance', performanceRouter);
app.use('/api/gamification', gamificationRouter);
app.use('/api/flashcards', flashcardRouter);
app.use('/api/chatbot', chatbotRouter);

// Initialize DB and start server
connectToDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});