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
// Define allowed origins based on environment
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://aistudybuddydt.vercel.app']
  : ['http://localhost:3000'];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});
const port = process.env.PORT || 5000;

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Base route and health check
app.get('/', (req, res) => {
  res.send('AI Study Buddy API is running');
});

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy', environment: process.env.NODE_ENV });
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