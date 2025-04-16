import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    activeStudyPlans: 0,
    completedPomodoros: 0,
    flashcardSets: 0,
    achievements: 0,
    points: 0,
    streak: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/dashboard');
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Welcome Back!</h1>
      
      <div className="quick-stats">
        <div className="stat-card">
          <h3>Study Plans</h3>
          <p>{summary.activeStudyPlans} Active</p>
          <Link to="/study-plan">View Plans</Link>
        </div>
        <div className="stat-card">
          <h3>Focus Sessions</h3>
          <p>{summary.completedPomodoros} Completed</p>
          <Link to="/pomodoro">Start Session</Link>
        </div>
        <div className="stat-card">
          <h3>Flashcards</h3>
          <p>{summary.flashcardSets} Sets</p>
          <Link to="/flashcards">Practice</Link>
        </div>
        <div className="stat-card">
          <h3>Achievements</h3>
          <p>{summary.achievements} Unlocked</p>
          <Link to="/gamification">View All</Link>
        </div>
      </div>

      <div className="features-grid">
        <Link to="/study-plan" className="feature-card">
          <h3>Study Planner</h3>
          <p>Create and manage your study schedules</p>
        </Link>
        <Link to="/pomodoro" className="feature-card">
          <h3>Focus Timer</h3>
          <p>Stay focused with Pomodoro technique</p>
        </Link>
        <Link to="/flashcards" className="feature-card">
          <h3>Flashcards</h3>
          <p>Create and review study materials</p>
        </Link>
        <Link to="/performance" className="feature-card">
          <h3>Performance</h3>
          <p>Track your learning progress</p>
        </Link>
        <Link to="/gamification" className="feature-card">
          <h3>Achievements</h3>
          <p>Earn rewards for your progress</p>
        </Link>
        <Link to="/chatbot" className="feature-card">
          <h3>AI Assistant</h3>
          <p>Get help with your studies</p>
        </Link>
      </div>

      <div className="streak-banner">
        <h3>Current Streak: {summary.streak} days</h3>
        <p>Keep learning daily to maintain your streak!</p>
      </div>
    </div>
  );
};

export default Dashboard;