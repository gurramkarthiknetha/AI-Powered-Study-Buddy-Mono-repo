import React, { useState, useEffect, useCallback } from 'react';
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    bio: '',
    educationLevel: '',
    subjects: [],
    learningGoals: [],
    preferredLearningStyle: '',
    studySchedule: {
      preferredTime: '',
      weeklyHours: 0
    },
    achievements: [],
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: ''
    }
  });

  const fetchProfile = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axios.get('http://localhost:8000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [getToken]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, user?.id]);

  const handleSave = async () => {
    try {
      const token = await getToken();
      await axios.put('http://localhost:8000/api/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e, field) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: e.target.value }
      }));
    } else {
      setProfile(prev => ({ ...prev, [field]: e.target.value }));
    }
  };

  const handleArrayChange = (value, field) => {
    setProfile(prev => ({
      ...prev,
      [field]: Array.isArray(value) ? value : value.split(',').map(item => item.trim())
    }));
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={user?.profileImageUrl} alt="Profile" className="profile-image" />
        <h1>{user?.fullName}</h1>
        <button onClick={() => setIsEditing(!isEditing)} className="edit-button">
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>About Me</h2>
          {isEditing ? (
            <textarea
              value={profile.bio}
              onChange={(e) => handleChange(e, 'bio')}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p>{profile.bio}</p>
          )}
        </div>

        <div className="profile-section">
          <h2>Education</h2>
          {isEditing ? (
            <select
              value={profile.educationLevel}
              onChange={(e) => handleChange(e, 'educationLevel')}
            >
              <option value="">Select Education Level</option>
              <option value="high_school">High School</option>
              <option value="bachelors">Bachelor's Degree</option>
              <option value="masters">Master's Degree</option>
              <option value="phd">PhD</option>
            </select>
          ) : (
            <p>{profile.educationLevel}</p>
          )}
        </div>

        <div className="profile-section">
          <h2>Subjects</h2>
          {isEditing ? (
            <input
              type="text"
              value={profile.subjects.join(', ')}
              onChange={(e) => handleArrayChange(e.target.value, 'subjects')}
              placeholder="Enter subjects (comma-separated)"
            />
          ) : (
            <ul>
              {profile.subjects.map((subject, index) => (
                <li key={index}>{subject}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="profile-section">
          <h2>Learning Goals</h2>
          {isEditing ? (
            <input
              type="text"
              value={profile.learningGoals.join(', ')}
              onChange={(e) => handleArrayChange(e.target.value, 'learningGoals')}
              placeholder="Enter goals (comma-separated)"
            />
          ) : (
            <ul>
              {profile.learningGoals.map((goal, index) => (
                <li key={index}>{goal}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="profile-section">
          <h2>Learning Style</h2>
          {isEditing ? (
            <select
              value={profile.preferredLearningStyle}
              onChange={(e) => handleChange(e, 'preferredLearningStyle')}
            >
              <option value="">Select Learning Style</option>
              <option value="visual">Visual</option>
              <option value="auditory">Auditory</option>
              <option value="reading">Reading/Writing</option>
              <option value="kinesthetic">Kinesthetic</option>
            </select>
          ) : (
            <p>{profile.preferredLearningStyle}</p>
          )}
        </div>

        <div className="profile-section">
          <h2>Study Schedule</h2>
          {isEditing ? (
            <>
              <input
                type="text"
                value={profile.studySchedule.preferredTime}
                onChange={(e) => handleChange(e, 'studySchedule.preferredTime')}
                placeholder="Preferred study time"
              />
              <input
                type="number"
                value={profile.studySchedule.weeklyHours}
                onChange={(e) => handleChange(e, 'studySchedule.weeklyHours')}
                placeholder="Weekly study hours"
              />
            </>
          ) : (
            <>
              <p>Preferred Time: {profile.studySchedule.preferredTime}</p>
              <p>Weekly Hours: {profile.studySchedule.weeklyHours}</p>
            </>
          )}
        </div>

        <div className="profile-section">
          <h2>Social Links</h2>
          {isEditing ? (
            <>
              <input
                type="url"
                value={profile.socialLinks.linkedin}
                onChange={(e) => handleChange(e, 'socialLinks.linkedin')}
                placeholder="LinkedIn URL"
              />
              <input
                type="url"
                value={profile.socialLinks.github}
                onChange={(e) => handleChange(e, 'socialLinks.github')}
                placeholder="GitHub URL"
              />
              <input
                type="url"
                value={profile.socialLinks.twitter}
                onChange={(e) => handleChange(e, 'socialLinks.twitter')}
                placeholder="Twitter URL"
              />
            </>
          ) : (
            <div className="social-links">
              {Object.entries(profile.socialLinks).map(([platform, url]) => (
                url && (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                )
              ))}
            </div>
          )}
        </div>

        {isEditing && (
          <button onClick={handleSave} className="save-button">
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;