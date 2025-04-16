import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/Dashboard';
import StudyPlan from './components/study/StudyPlan';
import Pomodoro from './components/pomodoro/Pomodoro';
import Flashcards from './components/flashcards/Flashcards';
import Performance from './components/performance/Performance';
import Gamification from './components/gamification/Gamification';
import Chatbot from './components/chatbot/Chatbot';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/study-plan" element={<StudyPlan />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/gamification" element={<Gamification />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
