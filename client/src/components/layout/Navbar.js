import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">AI Study Buddy</Link>
      <div className="nav-links">
        <Link to="/study-plan">Study Plan</Link>
        <Link to="/pomodoro">Pomodoro</Link>
        <Link to="/flashcards">Flashcards</Link>
        <Link to="/performance">Performance</Link>
        <Link to="/gamification">Rewards</Link>
        <Link to="/chatbot">AI Assistant</Link>
      </div>
    </nav>
  );
};

export default Navbar;