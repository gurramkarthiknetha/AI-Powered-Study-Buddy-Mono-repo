import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from "../../contexts/UserContext";
import { useAuth } from "../../contexts/AuthContext";
import axios from 'axios';
import { FaSpinner, FaCamera, FaTrash, FaLinkedin, FaGithub, FaTwitter, FaInstagram, FaGlobe } from 'react-icons/fa';
import { MdColorLens, MdNotifications, MdLock } from 'react-icons/md';
import './Profile.css';

const Profile = () => {
  const { user } = useUser();
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [imageFile, setImageFile] = useState(null);
  // imagePreview is used in the image upload flow but not rendered in the UI
  // eslint-disable-next-line no-unused-vars
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    bio: '',
    educationLevel: '',
    subjects: [],
    learningGoals: [],
    preferredLearningStyle: '',
    studySchedule: {
      preferredTime: '',
      weeklyHours: 0,
      preferredDays: [],
      reminderEnabled: false,
      reminderTime: ''
    },
    achievements: [],
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      instagram: '',
      website: ''
    },
    profileImage: {
      url: '',
      publicId: ''
    },
    preferences: {
      theme: 'system',
      accentColor: '#4a6cf7',
      notifications: {
        studyReminders: true,
        achievements: true,
        messages: true
      },
      privacy: {
        showProfileToOthers: true,
        showProgressToOthers: true,
        showAchievementsToOthers: true
      }
    }
  });

  const fetchProfile = useCallback(async () => {
    try {
      const token = currentUser?.token;
      if (!token) {
        console.error('No authentication token available');
        return;
      }
      const response = await axios.get('http://https://ai-powered-study-buddy-mono-repo.onrender.com/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, user?.id]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const token = currentUser?.token;
      if (!token) {
        setError('No authentication token available. Please log in again.');
        console.error('No authentication token available');
        setIsSaving(false);
        return;
      }

      // Use a temporary userId for testing if needed
      const profileData = {
        ...profile,
        userId: currentUser?.id || "507f1f77bcf86cd799439011" // Use a default ID for testing
      };

      await axios.put('http://https://ai-powered-study-buddy-mono-repo.onrender.com/api/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
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

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
      setError('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = useCallback(async () => {
    if (!imageFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const token = currentUser?.token;
      if (!token) {
        setError('No authentication token available. Please log in again.');
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post('http://https://ai-powered-study-buddy-mono-repo.onrender.com/api/profile/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setProfile(prev => ({
          ...prev,
          profileImage: response.data.profileImage
        }));

        // Clear the file input
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [imageFile, currentUser, fileInputRef, setError, setIsUploading, setImageFile, setImagePreview, setProfile]);

  const deleteProfileImage = async () => {
    if (!profile.profileImage?.url) return;

    setIsUploading(true);
    setError(null);

    try {
      const token = currentUser?.token;
      if (!token) {
        setError('No authentication token available. Please log in again.');
        setIsUploading(false);
        return;
      }

      await axios.delete('http://https://ai-powered-study-buddy-mono-repo.onrender.com/api/profile/image', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(prev => ({
        ...prev,
        profileImage: { url: '', publicId: '' }
      }));
    } catch (error) {
      console.error('Error deleting image:', error);
      setError(error.response?.data?.message || 'Failed to delete image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Function for updating user preferences - will be used in future implementation
  // eslint-disable-next-line no-unused-vars
  const updatePreferences = async (preferencesData) => {
    setIsSaving(true);
    setError(null);

    try {
      const token = currentUser?.token;
      if (!token) {
        setError('No authentication token available. Please log in again.');
        setIsSaving(false);
        return;
      }

      await axios.put('http://https://ai-powered-study-buddy-mono-repo.onrender.com/api/profile/preferences', preferencesData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(prev => ({
        ...prev,
        preferences: preferencesData
      }));
    } catch (error) {
      console.error('Error updating preferences:', error);
      setError(error.response?.data?.message || 'Failed to update preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Effect to upload image when imageFile changes
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile, uploadImage]);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image-container">
          <img
            src={profile.profileImage?.url || user?.profileImageUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-image"
          />
          {isEditing && (
            <div className="image-upload-controls">
              <button
                className="image-upload-button"
                onClick={handleImageClick}
                title="Upload new image"
              >
                <FaCamera />
              </button>
              {profile.profileImage?.url && (
                <button
                  className="image-delete-button"
                  onClick={deleteProfileImage}
                  title="Remove image"
                >
                  <FaTrash />
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg, image/png, image/gif"
                style={{ display: 'none' }}
              />
            </div>
          )}
          {isUploading && (
            <div className="image-upload-overlay">
              <FaSpinner className="spinner" />
            </div>
          )}
        </div>
        <h1>{user?.name || "User"}</h1>
        <button onClick={() => setIsEditing(!isEditing)} className="edit-button">
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Info
        </button>
        <button
          className={`tab-button ${activeTab === 'education' ? 'active' : ''}`}
          onClick={() => setActiveTab('education')}
        >
          Education & Goals
        </button>
        <button
          className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          Study Schedule
        </button>
        <button
          className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'personal' && (
          <>
            <div className="profile-section">
              <h2>About Me</h2>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleChange(e, 'bio')}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p>{profile.bio || "No bio provided yet."}</p>
              )}
            </div>

            <div className="profile-section">
              <h2>Social Links</h2>
              {isEditing ? (
                <>
                  <div className="input-with-icon">
                    <FaLinkedin className="input-icon" />
                    <input
                      type="url"
                      value={profile.socialLinks.linkedin}
                      onChange={(e) => handleChange(e, 'socialLinks.linkedin')}
                      placeholder="LinkedIn URL"
                    />
                  </div>
                  <div className="input-with-icon">
                    <FaGithub className="input-icon" />
                    <input
                      type="url"
                      value={profile.socialLinks.github}
                      onChange={(e) => handleChange(e, 'socialLinks.github')}
                      placeholder="GitHub URL"
                    />
                  </div>
                  <div className="input-with-icon">
                    <FaTwitter className="input-icon" />
                    <input
                      type="url"
                      value={profile.socialLinks.twitter}
                      onChange={(e) => handleChange(e, 'socialLinks.twitter')}
                      placeholder="Twitter URL"
                    />
                  </div>
                  <div className="input-with-icon">
                    <FaInstagram className="input-icon" />
                    <input
                      type="url"
                      value={profile.socialLinks.instagram}
                      onChange={(e) => handleChange(e, 'socialLinks.instagram')}
                      placeholder="Instagram URL"
                    />
                  </div>
                  <div className="input-with-icon">
                    <FaGlobe className="input-icon" />
                    <input
                      type="url"
                      value={profile.socialLinks.website}
                      onChange={(e) => handleChange(e, 'socialLinks.website')}
                      placeholder="Personal Website URL"
                    />
                  </div>
                </>
              ) : (
                <div className="social-links">
                  {Object.entries(profile.socialLinks).some(([_, url]) => url) ? (
                    Object.entries(profile.socialLinks).map(([platform, url]) => (
                      url && (
                        <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
                          {platform === 'linkedin' && <FaLinkedin />}
                          {platform === 'github' && <FaGithub />}
                          {platform === 'twitter' && <FaTwitter />}
                          {platform === 'instagram' && <FaInstagram />}
                          {platform === 'website' && <FaGlobe />}
                          <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                        </a>
                      )
                    ))
                  ) : (
                    <p>No social links added yet.</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'education' && (
          <>
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
                <p>{profile.educationLevel || "Not specified"}</p>
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
                  {profile.subjects.length > 0 ? (
                    profile.subjects.map((subject, index) => (
                      <li key={index}>{subject}</li>
                    ))
                  ) : (
                    <p>No subjects added yet.</p>
                  )}
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
                  {profile.learningGoals.length > 0 ? (
                    profile.learningGoals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))
                  ) : (
                    <p>No learning goals added yet.</p>
                  )}
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
                <p>{profile.preferredLearningStyle || "Not specified"}</p>
              )}
            </div>
          </>
        )}

        {activeTab === 'schedule' && (
          <div className="profile-section">
            <h2>Study Schedule</h2>
            {isEditing ? (
              <>
                <div className="form-group">
                  <label>Preferred Study Time</label>
                  <input
                    type="text"
                    value={profile.studySchedule.preferredTime}
                    onChange={(e) => handleChange(e, 'studySchedule.preferredTime')}
                    placeholder="e.g., Evenings, Mornings"
                  />
                </div>

                <div className="form-group">
                  <label>Weekly Study Hours</label>
                  <input
                    type="number"
                    value={profile.studySchedule.weeklyHours}
                    onChange={(e) => handleChange(e, 'studySchedule.weeklyHours')}
                    placeholder="Hours per week"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Preferred Study Days</label>
                  <div className="checkbox-group">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <label key={day} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={profile.studySchedule.preferredDays.includes(day)}
                          onChange={(e) => {
                            const days = e.target.checked
                              ? [...profile.studySchedule.preferredDays, day]
                              : profile.studySchedule.preferredDays.filter(d => d !== day);

                            setProfile(prev => ({
                              ...prev,
                              studySchedule: {
                                ...prev.studySchedule,
                                preferredDays: days
                              }
                            }));
                          }}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={profile.studySchedule.reminderEnabled}
                      onChange={(e) => handleChange({ target: { value: e.target.checked } }, 'studySchedule.reminderEnabled')}
                    />
                    Enable Study Reminders
                  </label>
                </div>

                {profile.studySchedule.reminderEnabled && (
                  <div className="form-group">
                    <label>Reminder Time</label>
                    <input
                      type="time"
                      value={profile.studySchedule.reminderTime}
                      onChange={(e) => handleChange(e, 'studySchedule.reminderTime')}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <p><strong>Preferred Time:</strong> {profile.studySchedule.preferredTime || "Not specified"}</p>
                <p><strong>Weekly Hours:</strong> {profile.studySchedule.weeklyHours || 0}</p>

                <p><strong>Preferred Days:</strong></p>
                {profile.studySchedule.preferredDays && profile.studySchedule.preferredDays.length > 0 ? (
                  <ul className="days-list">
                    {profile.studySchedule.preferredDays.map(day => (
                      <li key={day}>{day}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No preferred days selected.</p>
                )}

                <p>
                  <strong>Study Reminders:</strong> {profile.studySchedule.reminderEnabled ? 'Enabled' : 'Disabled'}
                  {profile.studySchedule.reminderEnabled && profile.studySchedule.reminderTime && (
                    <span> at {profile.studySchedule.reminderTime}</span>
                  )}
                </p>
              </>
            )}
          </div>
        )}

        {activeTab === 'preferences' && (
          <>
            <div className="profile-section">
              <h2><MdColorLens /> Theme Preferences</h2>
              {isEditing ? (
                <>
                  <div className="form-group">
                    <label>Theme Mode</label>
                    <select
                      value={profile.preferences.theme}
                      onChange={(e) => {
                        setProfile(prev => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            theme: e.target.value
                          }
                        }));
                      }}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Accent Color</label>
                    <div className="color-picker">
                      <input
                        type="color"
                        value={profile.preferences.accentColor}
                        onChange={(e) => {
                          setProfile(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              accentColor: e.target.value
                            }
                          }));
                        }}
                      />
                      <span>{profile.preferences.accentColor}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Theme Mode:</strong> {profile.preferences.theme.charAt(0).toUpperCase() + profile.preferences.theme.slice(1)}</p>
                  <p><strong>Accent Color:</strong> <span className="color-sample" style={{ backgroundColor: profile.preferences.accentColor }}></span> {profile.preferences.accentColor}</p>
                </>
              )}
            </div>

            <div className="profile-section">
              <h2><MdNotifications /> Notification Preferences</h2>
              {isEditing ? (
                <>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profile.preferences.notifications.studyReminders}
                        onChange={(e) => {
                          setProfile(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              notifications: {
                                ...prev.preferences.notifications,
                                studyReminders: e.target.checked
                              }
                            }
                          }));
                        }}
                      />
                      Study Reminders
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profile.preferences.notifications.achievements}
                        onChange={(e) => {
                          setProfile(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              notifications: {
                                ...prev.preferences.notifications,
                                achievements: e.target.checked
                              }
                            }
                          }));
                        }}
                      />
                      Achievement Notifications
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profile.preferences.notifications.messages}
                        onChange={(e) => {
                          setProfile(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              notifications: {
                                ...prev.preferences.notifications,
                                messages: e.target.checked
                              }
                            }
                          }));
                        }}
                      />
                      Message Notifications
                    </label>
                  </div>
                </>
              ) : (
                <ul className="preferences-list">
                  <li>
                    <strong>Study Reminders:</strong> {profile.preferences.notifications.studyReminders ? 'Enabled' : 'Disabled'}
                  </li>
                  <li>
                    <strong>Achievement Notifications:</strong> {profile.preferences.notifications.achievements ? 'Enabled' : 'Disabled'}
                  </li>
                  <li>
                    <strong>Message Notifications:</strong> {profile.preferences.notifications.messages ? 'Enabled' : 'Disabled'}
                  </li>
                </ul>
              )}
            </div>

            <div className="profile-section">
              <h2><MdLock /> Privacy Settings</h2>
              {isEditing ? (
                <>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profile.preferences.privacy.showProfileToOthers}
                        onChange={(e) => {
                          setProfile(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              privacy: {
                                ...prev.preferences.privacy,
                                showProfileToOthers: e.target.checked
                              }
                            }
                          }));
                        }}
                      />
                      Show my profile to other users
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profile.preferences.privacy.showProgressToOthers}
                        onChange={(e) => {
                          setProfile(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              privacy: {
                                ...prev.preferences.privacy,
                                showProgressToOthers: e.target.checked
                              }
                            }
                          }));
                        }}
                      />
                      Show my progress to other users
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profile.preferences.privacy.showAchievementsToOthers}
                        onChange={(e) => {
                          setProfile(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              privacy: {
                                ...prev.preferences.privacy,
                                showAchievementsToOthers: e.target.checked
                              }
                            }
                          }));
                        }}
                      />
                      Show my achievements to other users
                    </label>
                  </div>
                </>
              ) : (
                <ul className="preferences-list">
                  <li>
                    <strong>Show Profile:</strong> {profile.preferences.privacy.showProfileToOthers ? 'Yes' : 'No'}
                  </li>
                  <li>
                    <strong>Show Progress:</strong> {profile.preferences.privacy.showProgressToOthers ? 'Yes' : 'No'}
                  </li>
                  <li>
                    <strong>Show Achievements:</strong> {profile.preferences.privacy.showAchievementsToOthers ? 'Yes' : 'No'}
                  </li>
                </ul>
              )}
            </div>
          </>
        )}

        {error && <div className="error-message">{error}</div>}

        {isEditing && (
          <button
            onClick={handleSave}
            className="save-button"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <FaSpinner className="spinner" /> Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;