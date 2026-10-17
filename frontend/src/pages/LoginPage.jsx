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

  const handleDemoSelect = (username, password) => {
    setCredentials({ username, password });
    setError('');
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
      <div className="login-backdrop-glow"></div>
      
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-logo-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
          <h2>OptiWheels Logistics</h2>
          <p className="brand-sub">Fleet Maintenance Management System</p>
        </div>

        <div className="login-header">
          <h3>Sign in to your portal</h3>
          <p className="login-subtitle">Enter your role credentials or pick a demo account below</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="login-username">Username</label>
            <div className="input-wrapper">
              <input
                id="login-username"
                name="username"
                type="text"
                placeholder="e.g. manager1"
                value={credentials.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
          </div>
          
          {error && (
            <div id="login-error" className="error-message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? (
              <span className="btn-loading-content">
                <span className="spinner"></span> Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>
        
        <div className="demo-accounts">
          <div className="demo-header">
            <h4>Quick Demo Access</h4>
            <span className="demo-hint">(Click to auto-fill)</span>
          </div>
          <div className="demo-buttons-grid">
            <button
              type="button"
              className={`demo-btn ${credentials.username === 'manager1' ? 'active' : ''}`}
              onClick={() => handleDemoSelect('manager1', 'manager123')}
            >
              <div className="demo-role-badge badge-manager">Manager</div>
              <div className="demo-creds">manager1</div>
            </button>
            <button
              type="button"
              className={`demo-btn ${credentials.username === 'driver1' ? 'active' : ''}`}
              onClick={() => handleDemoSelect('driver1', 'driver123')}
            >
              <div className="demo-role-badge badge-driver">Driver</div>
              <div className="demo-creds">driver1</div>
            </button>
            <button
              type="button"
              className={`demo-btn ${credentials.username === 'mechanic1' ? 'active' : ''}`}
              onClick={() => handleDemoSelect('mechanic1', 'mechanic123')}
            >
              <div className="demo-role-badge badge-mechanic">Mechanic</div>
              <div className="demo-creds">mechanic1</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;