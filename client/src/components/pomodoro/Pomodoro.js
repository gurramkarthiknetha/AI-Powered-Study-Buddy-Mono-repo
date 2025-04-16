import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Pomodoro.css';

const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [blockedSites, setBlockedSites] = useState(['']);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/pomodoro');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleSessionComplete = useCallback(async () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    fetchSessions();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleSessionComplete]);

  const startTimer = async () => {
    try {
      await axios.post('http://localhost:8000/api/pomodoro', {
        user_id: "507f1f77bcf86cd799439011",
        start_time: new Date(),
        end_time: new Date(Date.now() + timeLeft * 1000),
        session_duration: 25,
        distractions_blocked: blockedSites.filter(site => site)
      });
      setIsActive(true);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="pomodoro">
      <div className="timer-container">
        <h2>Pomodoro Timer</h2>
        <div className="timer">{formatTime(timeLeft)}</div>
        <button 
          onClick={isActive ? () => setIsActive(false) : startTimer}
          className={isActive ? 'stop' : 'start'}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
      </div>

      <div className="distraction-blocker">
        <h3>Distraction Blocker</h3>
        {blockedSites.map((site, index) => (
          <input
            key={index}
            type="text"
            placeholder="Enter website to block"
            value={site}
            onChange={(e) => {
              const newSites = [...blockedSites];
              newSites[index] = e.target.value;
              if (index === blockedSites.length - 1) {
                newSites.push('');
              }
              setBlockedSites(newSites);
            }}
          />
        ))}
      </div>

      <div className="sessions-history">
        <h3>Recent Sessions</h3>
        {sessions.map((session) => (
          <div key={session._id} className="session-card">
            <p>Duration: {session.session_duration} minutes</p>
            <p>Started: {new Date(session.start_time).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pomodoro;