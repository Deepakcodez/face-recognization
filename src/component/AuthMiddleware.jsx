// AuthMiddleware.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from './Home.jsx';

const AuthMiddleware = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/faceAuth');
    }
  }, [isAuthenticated, navigate]);

  return <Home />;
};

export default AuthMiddleware;
