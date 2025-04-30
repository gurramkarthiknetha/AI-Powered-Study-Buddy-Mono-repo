import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser, SignOutButton } from "@clerk/clerk-react";
import ThemeToggle from './ThemeToggle';
import './Navbar.css';
import {
  FaHome,
  FaBook,
  FaClock,
  FaChartBar,
  FaTrophy,
  FaComments,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaStickyNote
} from 'react-icons/fa';

const Navbar = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="mobile-header">
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      <div className="nav-profile">
        <img src={user?.imageUrl || user?.profileImageUrl} alt="Profile" className="profile-pic" />
        <h3>{user?.fullName}</h3>
        <div className="desktop-theme-toggle">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>

      <ul className="nav-links">
        <li className={isActive('/') ? 'active' : ''}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}><FaHome /> Dashboard</Link>
        </li>
        <li className={isActive('/profile') ? 'active' : ''}>
          <Link to="/profile" onClick={() => setIsMenuOpen(false)}><FaUser /> Profile</Link>
        </li>
        <li className={isActive('/study-plan') ? 'active' : ''}>
          <Link to="/study-plan" onClick={() => setIsMenuOpen(false)}><FaBook /> Study Plan</Link>
        </li>
        <li className={isActive('/pomodoro') ? 'active' : ''}>
          <Link to="/pomodoro" onClick={() => setIsMenuOpen(false)}><FaClock /> Pomodoro</Link>
        </li>
        <li className={isActive('/notes') ? 'active' : ''}>
          <Link to="/notes" onClick={() => setIsMenuOpen(false)}><FaStickyNote /> Notes</Link>
        </li>
        <li className={isActive('/performance') ? 'active' : ''}>
          <Link to="/performance" onClick={() => setIsMenuOpen(false)}><FaChartBar /> Performance</Link>
        </li>
        <li className={isActive('/gamification') ? 'active' : ''}>
          <Link to="/gamification" onClick={() => setIsMenuOpen(false)}><FaTrophy /> Gamification</Link>
        </li>
        <li className={isActive('/chatbot') ? 'active' : ''}>
          <Link to="/chatbot" onClick={() => setIsMenuOpen(false)}><FaComments /> Chat Assistant</Link>
        </li>
      </ul>

      <div className="nav-footer">
        <SignOutButton>
          <button className="sign-out-button">
            <FaSignOutAlt /> Sign Out
          </button>
        </SignOutButton>
      </div>
    </nav>
  );
};

export default Navbar;