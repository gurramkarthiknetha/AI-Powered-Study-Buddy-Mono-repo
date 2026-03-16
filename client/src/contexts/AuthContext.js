import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userAvatar = localStorage.getItem('userAvatar');

    if (token && userId) {
      setCurrentUser({
        id: userId,
        name: userName,
        email: userEmail,
        token,
        avatar: userAvatar,
        profileImageUrl: userAvatar
      });
    }
    setLoading(false);
  }, []);

  // Called after Google OAuth redirect with URL params
  const handleOAuthCallback = (token, userId, name, email, avatar = '') => {
    setError(null);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userAvatar', avatar || '');
    setCurrentUser({
      id: userId,
      name,
      email,
      token,
      avatar,
      profileImageUrl: avatar
    });
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userAvatar');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    handleOAuthCallback,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

