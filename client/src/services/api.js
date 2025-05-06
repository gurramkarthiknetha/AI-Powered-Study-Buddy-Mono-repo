import axios from 'axios';

const API_URL = 'http://https://ai-powered-study-buddy-mono-repo.onrender.com/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gamification API calls
export const gamificationApi = {
  // Get all gamification data
  getAll: () => api.get('/gamification'),
  
  // Get user's gamification data
  getUserData: (userId) => api.get(`/gamification/user/${userId}`),
  
  // Update user progress
  updateProgress: (userId, progressData) => api.patch(`/gamification/${userId}/progress`, progressData),
  
  // Update achievements
  updateAchievements: (userId, achievements) => api.patch(`/gamification/${userId}/achievements`, achievements),
  
  // Update a single achievement
  updateAchievement: (userId, achievementId, achievementData) => 
    api.patch(`/gamification/${userId}/achievements/${achievementId}`, achievementData),
  
  // Update study stats
  updateStats: (userId, statsData) => api.patch(`/gamification/${userId}/stats`, statsData),
  
  // Update points
  updatePoints: (userId, points) => api.patch(`/gamification/${userId}/points`, { points }),
  
  // Add badge
  addBadge: (userId, badge) => api.patch(`/gamification/${userId}/badges`, { badge }),
};

// Flashcards API calls
export const flashcardsApi = {
  getAll: () => api.get('/flashcards'),
  getUserFlashcards: (userId) => api.get(`/flashcards/user/${userId}`),
  getBySubject: (subject) => api.get(`/flashcards/subject/${subject}`),
  create: (flashcardData) => api.post('/flashcards', flashcardData),
  update: (id, flashcardData) => api.put(`/flashcards/${id}`, flashcardData),
  delete: (id) => api.delete(`/flashcards/${id}`),
};

// Pomodoro API calls
export const pomodoroApi = {
  getAll: () => api.get('/pomodoro'),
  getUserSessions: (userId) => api.get(`/pomodoro/user/${userId}`),
  createSession: (sessionData) => api.post('/pomodoro', sessionData),
};

// Performance API calls
export const performanceApi = {
  getAll: () => api.get('/performance'),
  getUserPerformance: (userId) => api.get(`/performance/user/${userId}`),
  create: (performanceData) => api.post('/performance', performanceData),
};

// Auth API calls
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export default api;
