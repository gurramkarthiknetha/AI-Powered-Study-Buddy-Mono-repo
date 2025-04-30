import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser, SignOutButton } from "@clerk/clerk-react";
import './Navbar.css';
import { 
  FaHome, 
  FaBook, 
  FaClock, 
  FaChartBar, 
  FaTrophy, 
  FaComments,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const { user } = useUser();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-profile">
        <img src={user?.profileImageUrl} alt="Profile" className="profile-pic" />
        <h3>{user?.fullName}</h3>
      </div>
      
      <ul className="nav-links">
        <li className={isActive('/') ? 'active' : ''}>
          <Link to="/"><FaHome /> Dashboard</Link>
        </li>
        <li className={isActive('/profile') ? 'active' : ''}>
          <Link to="/profile"><FaUser /> Profile</Link>
        </li>
        <li className={isActive('/study-plan') ? 'active' : ''}>
          <Link to="/study-plan"><FaBook /> Study Plan</Link>
        </li>
        <li className={isActive('/pomodoro') ? 'active' : ''}>
          <Link to="/pomodoro"><FaClock /> Pomodoro</Link>
        </li>
        <li className={isActive('/performance') ? 'active' : ''}>
          <Link to="/performance"><FaChartBar /> Performance</Link>
        </li>
        <li className={isActive('/gamification') ? 'active' : ''}>
          <Link to="/gamification"><FaTrophy /> Gamification</Link>
        </li>
        <li className={isActive('/chatbot') ? 'active' : ''}>
          <Link to="/chatbot"><FaComments /> Chat Assistant</Link>
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