import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
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
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
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

// Set up Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a room based on user ID for targeted updates
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to our routes
app.set('io', io);

// Initialize DB and start server
connectToDB().then(() => {
  httpServer.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Socket.IO is listening for connections`);
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