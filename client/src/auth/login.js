import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './login.css';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:6223/api';

function Login() {
  const { currentUser } = useAuth();

  const storedToken = localStorage.getItem('token');
  const storedUserId = localStorage.getItem('userId');
  const isAuthenticated = Boolean(currentUser || (storedToken && storedUserId));

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const urlParams = new URLSearchParams(window.location.search);
  const authError = urlParams.get('error');

  const handleEmailLogin = (event) => {
    event.preventDefault();
  };

  return (
    <div className="login-page">
      <section
        className="login-hero"
        aria-hidden="true"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/login.jpeg)` }}
      >
        <div className="login-hero-overlay" />
        <div className="login-hero-content">
          <p className="login-hero-tag">AI Powered Study Buddy</p>
          <h1>Study Smarter. Achieve More.</h1>
          <p>
            Build better study habits with flashcards, focused sessions, and AI guidance tailored
            to your goals.
          </p>
        </div>
      </section>

      <section
        className="login-panel"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/login.jpeg)` }}
      >
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue your learning journey</p>

          {authError && (
            <div className="error-message">Authentication failed. Please try again.</div>
          )}

          <form className="login-form" onSubmit={handleEmailLogin}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />

            <div className="login-actions">
              <Link to="/forgot-password" className="inline-link">
                Forgot Password?
              </Link>
            </div>

            <button className="login-button" type="submit">
              Login
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button className="google-auth-button" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </g>
            </svg>
            Continue with Google
          </button>

          <p className="signup-copy">
            New here? <Link to="/register">Create Account / Sign Up</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
