import React from 'react';
import { Navigate } from 'react-router-dom';

// Registration is handled via Google OAuth — redirect to login
function Register() {
  return <Navigate to="/login" replace />;
}

export default Register;
