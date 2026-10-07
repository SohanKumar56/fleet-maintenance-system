import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Client-side validation
    if (!credentials.username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (!credentials.password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      const userData = await authService.login(credentials);
      login(userData);
      
      // Navigate based on role
      switch (userData.role) {
        case 'MANAGER':
          navigate('/manager');
          break;
        case 'DRIVER':
          navigate('/driver');
          break;
        case 'MECHANIC':
          navigate('/mechanic');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Fleet Maintenance System</h2>
        <h3>Login</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-username">Username:</label>
            <input
              id="login-username"
              name="username"
              type="text"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="login-password">Password:</label>
            <input
              id="login-password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          
          {error && (
            <div id="login-error" className="error-message">
              {error}
            </div>
          )}
          
          <button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="demo-accounts">
          <h4>Demo Accounts:</h4>
          <p>Manager: manager1 / manager123</p>
          <p>Driver: driver1 / driver123</p>
          <p>Mechanic: mechanic1 / mechanic123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;