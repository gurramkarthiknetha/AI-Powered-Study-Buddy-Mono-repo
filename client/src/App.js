import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
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
import ThemeToggle from './components/layout/ThemeToggle';
import './App.css';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function PrivateRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
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

  if (!clerkPubKey) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Configuration Error</h1>
        <p>Clerk publishable key is missing. Please check your environment configuration.</p>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <div className="app">
          <SignedIn>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
          </SignedIn>
          <main className="main-content">
            <Routes>
              <Route path="/sign-in/*" element={<SignedOut><RedirectToSignIn /></SignedOut>} />
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/study-plan" element={
                <PrivateRoute>
                  <StudyPlan />
                </PrivateRoute>
              } />
              <Route path="/pomodoro" element={
                <PrivateRoute>
                  <Pomodoro />
                </PrivateRoute>
              } />
              <Route path="/flashcards" element={
                <PrivateRoute>
                  <Flashcards />
                </PrivateRoute>
              } />
              <Route path="/notes" element={
                <PrivateRoute>
                  <Notes />
                </PrivateRoute>
              } />
              <Route path="/performance" element={
                <PrivateRoute>
                  <Performance />
                </PrivateRoute>
              } />
              <Route path="/gamification" element={
                <PrivateRoute>
                  <Gamification />
                </PrivateRoute>
              } />
              <Route path="/chatbot" element={
                <PrivateRoute>
                  <Chatbot />
                </PrivateRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;
