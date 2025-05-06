import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import Navbar from './components/layout/Navbar';
import Profile from './components/profile/Profile';
import Dashboard from './components/Dashboard';
import StudyPlan from './components/study/StudyPlan';
import Pomodoro from './components/pomodoro/Pomodoro';
import Flashcards from './components/flashcards/Flashcards';
import Notes from './components/notes/Notes';
import Performance from './components/performance/Performance';
import Gamification from './components/gamification/Gamification';
import Chatbot from './components/chatbot/Chatbot';
import Login from './auth/login';
import Register from './auth/register';
import './App.css';

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <div className="app">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/*" element={
                <PrivateRouteWrapper>
                  <Navbar theme={theme} toggleTheme={toggleTheme} />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/study-plan" element={<StudyPlan />} />
                      <Route path="/pomodoro" element={<Pomodoro />} />
                      <Route path="/flashcards" element={<Flashcards />} />
                      <Route path="/notes" element={<Notes />} />
                      <Route path="/performance" element={<Performance />} />
                      <Route path="/gamification" element={<Gamification />} />
                      <Route path="/chatbot" element={<Chatbot />} />
                    </Routes>
                  </main>
                </PrivateRouteWrapper>
              } />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

// Wrapper component to handle private routes
function PrivateRouteWrapper({ children }) {
  return (
    <PrivateRoute>
      {children}
    </PrivateRoute>
  );
}

export default App;
