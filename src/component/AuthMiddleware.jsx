// AuthMiddleware.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from './Home.jsx';
import { AuthContext}  from '../Context.jsx';

const AuthMiddleware = () => {

  const navigate = useNavigate();
  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext)
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/faceAuth');
    }
  }, [isAuthenticated, navigate]);

  return <Home />;
};

export default AuthMiddleware;
