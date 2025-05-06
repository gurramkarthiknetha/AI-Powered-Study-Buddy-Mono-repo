import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './Performance.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Performance = () => {
  const [statistics, setStatistics] = useState({
    studyTime: [],
    subjectProgress: [],
    achievements: [],
    weeklyActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://ai-powered-study-buddy-mono-repo.onrender.com/api/performance');
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="performance">Loading...</div>;
  }

  return (
    <div className="performance">
      <h2>Performance Analytics</h2>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Study Time Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statistics.studyTime}
                dataKey="value"
                nameKey="subject"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {statistics.studyTime.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Subject Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistics.subjectProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={statistics.weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="achievement-summary">
          <h3>Recent Achievements</h3>
          <div className="achievement-list">
            {statistics.achievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-details">
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                  <span className="achievement-date">
                    {new Date(achievement.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;