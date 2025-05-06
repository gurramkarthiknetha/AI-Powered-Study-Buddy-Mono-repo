import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../contexts/UserContext";
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useUser();
  const [summary, setSummary] = useState({
    activeStudyPlans: 0,
    completedPomodoros: 0,
    flashcardSets: 0,
    achievements: 0,
    points: 0,
    streak: 0
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [upcomingEvents] = useState([
    { title: "Math Study Session", time: "Today, 3:00 PM" },
    { title: "Physics Assignment Due", time: "Tomorrow, 11:59 PM" }
  ]);

  useEffect(() => {
    fetchDashboardData();

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://https://ai-powered-study-buddy-mono-repo.onrender.com/api/dashboard');
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return currentTime.toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="welcome-section">
        <div className="welcome-text">
          <h2>{getGreeting()}, {user?.name?.split(' ')[0] || 'Student'}!</h2>
          <p>Today is {formatDate()}</p>
          <p>You have {upcomingEvents.length} upcoming events and {summary.activeStudyPlans} active study plans.</p>
          <Link to="/study-plan" className="btn">View Your Schedule</Link>
        </div>
        <img
          src={user?.profileImageUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"}
          alt="Profile"
          className="welcome-image"
        />
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <h3>Study Plans</h3>
          <p>{summary.activeStudyPlans}</p>
          <Link to="/study-plan">View Plans</Link>
        </div>
        <div className="stat-card">
          <h3>Focus Sessions</h3>
          <p>{summary.completedPomodoros}</p>
          <Link to="/pomodoro">Start Session</Link>
        </div>
        <div className="stat-card">
          <h3>Flashcards</h3>
          <p>{summary.flashcardSets}</p>
          <Link to="/flashcards">Practice</Link>
        </div>
        <div className="stat-card">
          <h3>Achievements</h3>
          <p>{summary.achievements}</p>
          <Link to="/gamification">View All</Link>
        </div>
      </div>

      <h2>Your Study Tools</h2>
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
        <Link to="/notes" className="feature-card">
          <h3>Notes & Resources</h3>
          <p>Organize your study materials</p>
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