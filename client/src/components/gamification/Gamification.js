import React, { useState, useEffect } from 'react';
import { FaStar, FaChartLine } from 'react-icons/fa';
import { gamificationApi } from '../../services/api';
import { useUser } from '../../contexts/UserContext';
import './Gamification.css';

const Gamification = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  // Default values that will be replaced with data from the backend
  const [userProgress, setUserProgress] = useState({
    level: 1,
    experience: 0,
    nextLevelXP: 1000,
    totalPoints: 0,
    streak: 0
  });

  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [studyStats, setStudyStats] = useState({
    totalStudyTime: "0h 0m",
    sessionsCompleted: 0,
    averageScore: 0,
    topSubject: ""
  });

  // Fetch gamification data from the backend
  useEffect(() => {
    const fetchGamificationData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        const userId = user.id;
        const response = await gamificationApi.getUserData(userId);
        const data = response.data;

        // Update state with data from the backend
        if (data.userProgress) {
          setUserProgress(data.userProgress);
        }

        if (data.achievements) {
          setAchievements(data.achievements);
        }

        if (data.leaderboard) {
          setLeaderboard(data.leaderboard);
        }

        if (data.studyStats) {
          setStudyStats(data.studyStats);
        }

      } catch (err) {
        console.error('Error fetching gamification data:', err);
        const errorMessage = 'Failed to load gamification data. Please try again later.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGamificationData();

    // Set up polling for real-time updates (every 30 seconds)
    const pollingInterval = setInterval(fetchGamificationData, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(pollingInterval);
  }, [user]);

  if (isLoading) {
    return (
      <div className="gamification-container loading">
        <div className="loading-message">Loading gamification data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gamification-container error">
        <div className="error-message">{error}</div>
        <button onClick={() => window.location.reload()} className="retry-button">
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="gamification-container">
      <div className="user-progress-section">
        <h2>Your Progress</h2>
        <div className="progress-stats">
          <div className="level-info">
            <h3>Level {userProgress.level}</h3>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{width: `${(userProgress.experience/userProgress.nextLevelXP)*100}%`}}
              ></div>
            </div>
            <p>{userProgress.experience} / {userProgress.nextLevelXP} XP</p>
          </div>
          <div className="points-info">
            <FaStar className="icon" />
            <p>{userProgress.totalPoints} Points</p>
          </div>
          <div className="streak-info">
            <FaChartLine className="icon" />
            <p>{userProgress.streak} Day Streak</p>
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          {achievements.length > 0 ? (
            achievements.map(achievement => (
              <div key={achievement.id} className={`achievement-card ${achievement.completed ? 'completed' : ''}`}>
                <div className="achievement-icon">{achievement.icon}</div>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                <div className="achievement-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{width: `${achievement.progress}%`}}
                    ></div>
                  </div>
                  <span>{achievement.progress}%</span>
                </div>
                <p className="reward">+{achievement.reward} XP</p>
              </div>
            ))
          ) : (
            <div className="no-data-message">No achievements available yet</div>
          )}
        </div>
      </div>

      <div className="stats-section">
        <h2>Study Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Study Time</h3>
            <p>{studyStats.totalStudyTime}</p>
          </div>
          <div className="stat-card">
            <h3>Sessions Completed</h3>
            <p>{studyStats.sessionsCompleted}</p>
          </div>
          <div className="stat-card">
            <h3>Average Score</h3>
            <p>{studyStats.averageScore}%</p>
          </div>
          <div className="stat-card">
            <h3>Top Subject</h3>
            <p>{studyStats.topSubject || 'None yet'}</p>
          </div>
        </div>
      </div>

      <div className="leaderboard-section">
        <h2>Leaderboard</h2>
        <div className="leaderboard-list">
          {leaderboard.length > 0 ? (
            leaderboard.map((user) => (
              <div key={user.id} className={`leaderboard-item ${user.name === 'You' ? 'current-user' : ''}`}>
                <div className="rank">#{user.rank}</div>
                <div className="user-name">{user.name}</div>
                <div className="points">
                  <FaStar className="icon" />
                  {user.points}
                </div>
              </div>
            ))
          ) : (
            <div className="no-data-message">No leaderboard data available yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gamification;