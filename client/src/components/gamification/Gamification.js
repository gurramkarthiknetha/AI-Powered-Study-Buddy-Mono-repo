import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gamification.css';

const Gamification = () => {
  const [achievements, setAchievements] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [userStats] = useState({
    points: 0,
    level: 1,
    streak: 0
  });

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    try {
      const [achievementsRes, rewardsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/achievements'),
        axios.get('http://localhost:8000/api/rewards')
      ]);
      setAchievements(achievementsRes.data);
      setRewards(rewardsRes.data);
    } catch (error) {
      console.error('Error fetching gamification data:', error);
    }
  };

  return (
    <div className="gamification">
      <div className="user-progress">
        <h2>Your Progress</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <h3>Points</h3>
            <p>{userStats.points}</p>
          </div>
          <div className="stat-item">
            <h3>Level</h3>
            <p>{userStats.level}</p>
          </div>
          <div className="stat-item">
            <h3>Study Streak</h3>
            <p>{userStats.streak} days</p>
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <div 
              key={achievement._id} 
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">🏆</div>
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{width: `${(achievement.current_progress / achievement.target_progress) * 100}%`}}
                ></div>
              </div>
              <p className="progress-text">
                {achievement.current_progress} / {achievement.target_progress}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rewards-section">
        <h2>Available Rewards</h2>
        <div className="rewards-grid">
          {rewards.map((reward) => (
            <div key={reward._id} className="reward-card">
              <h3>{reward.title}</h3>
              <p>{reward.description}</p>
              <p className="points-cost">{reward.points_required} points</p>
              <button 
                disabled={userStats.points < reward.points_required}
                onClick={async () => {
                  try {
                    await axios.post('http://localhost:8000/api/rewards/claim', {
                      reward_id: reward._id,
                      user_id: "507f1f77bcf86cd799439011"
                    });
                    fetchGamificationData();
                  } catch (error) {
                    console.error('Error claiming reward:', error);
                  }
                }}
              >
                Claim Reward
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gamification;