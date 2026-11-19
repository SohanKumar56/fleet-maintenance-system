import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import './LoginPage.css';
import heroBg from '../assets/fleet-hero.png';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const initialRole = searchParams.get('role') || 'DRIVER';

  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  
  // Sign in state
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  // Sign up state
  const [registerData, setRegisterData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: initialRole
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoCreds, setShowDemoCreds] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'signup') {
      setMode('signup');
    } else if (urlMode === 'signin') {
      setMode('signin');
    }
  }, [searchParams]);

  // Handle Sign In input change
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Sign Up input change
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDemoSelect = (username, password) => {
    setMode('signin');
    setCredentials({ username, password });
    setError('');
  };

  // Handle Sign In submission (authenticates against H2 database)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    const un = credentials.username.trim();
    const pw = credentials.password.trim();

    if (!un) {
      setError('Username is required');
      return;
    }
    
    if (!pw) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      const userData = await authService.login({ username: un, password: pw });
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
      setError(err.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up submission (stores new user into H2 database)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const fn = registerData.fullName.trim();
    const un = registerData.username.trim();
    const pw = registerData.password;
    const cpw = registerData.confirmPassword;
    const role = registerData.role;

    if (!fn) {
      setError('Full name is required');
      return;
    }

    if (!un || un.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!pw || pw.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (pw !== cpw) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // POST to /api/auth/register (saved in H2 users table)
      const userData = await authService.register({
        fullName: fn,
        username: un,
        password: pw,
        role: role
      });

      setSuccessMsg('Account created successfully! Connecting to your portal...');
      
      // Log the user in directly with the returned JWT token
      setTimeout(() => {
        login(userData);
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
      }, 700);

    } catch (err) {
      setError(err.message || 'Registration failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Background illustration with vehicle backdrop */}
      <div className="login-vehicles-bg" style={{ backgroundImage: `url(${heroBg})` }}></div>
      <div className="login-bg-overlay"></div>
      <div className="login-backdrop-glow"></div>

      {/* Top Navigation */}
      <header className="auth-top-nav">
        <Link to="/" className="back-to-home-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to OptiWheels Home</span>
        </Link>
        <div className="auth-db-tag">
          <span className="dot-green"></span>
          <span>H2 Database Engine Active</span>
        </div>
      </header>

      {/* Main Auth Card */}
      <div className="auth-card-container">
        <div className="login-card">
          <div className="login-brand">
            <div className="brand-logo-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <h2>OptiWheels Logistics</h2>
            <p className="brand-sub">Smart Fleet Maintenance Management System</p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="auth-mode-tabs">
            <button
              type="button"
              id="tab-signin"
              className={`mode-tab ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => { setMode('signin'); setError(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              id="tab-signup"
              className={`mode-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setError(''); }}
            >
              Create Account (Sign Up)
            </button>
          </div>

          {/* SIGN IN FORM */}
          {mode === 'signin' ? (
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="auth-form-intro">
                <h3>Sign in to your account</h3>
                <p>Enter your credentials stored in the H2 Database</p>
              </div>

              <div className="form-group">
                <label htmlFor="login-username">Username</label>
                <div className="input-wrapper">
                  <input
                    id="login-username"
                    name="username"
                    type="text"
                    placeholder="e.g. manager1, or your created username"
                    value={credentials.username}
                    onChange={handleLoginChange}
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
                    onChange={handleLoginChange}
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

              {successMsg && (
                <div className="success-message">
                  <span>✓ {successMsg}</span>
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
                    <span className="spinner"></span> Authenticating with H2 DB...
                  </span>
                ) : 'Sign In to Portal'}
              </button>

              <div className="auth-switch-prompt">
                <span>Don't have an account yet? </span>
                <button type="button" className="link-button" onClick={() => { setMode('signup'); setError(''); }}>
                  Sign up & register now
                </button>
              </div>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleRegisterSubmit} className="login-form">
              <div className="auth-form-intro">
                <h3>Register New User</h3>
                <p>Credentials will be saved into the H2 Database</p>
              </div>

              <div className="form-group">
                <label htmlFor="reg-fullname">Full Name</label>
                <div className="input-wrapper">
                  <input
                    id="reg-fullname"
                    name="fullName"
                    type="text"
                    placeholder="e.g. Alex Johnson"
                    value={registerData.fullName}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-username">Username</label>
                <div className="input-wrapper">
                  <input
                    id="reg-username"
                    name="username"
                    type="text"
                    placeholder="e.g. alex_fleet"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Operational Role</label>
                <div className="role-selector-pills">
                  <button
                    type="button"
                    className={`role-pill ${registerData.role === 'MANAGER' ? 'active' : ''}`}
                    onClick={() => setRegisterData(prev => ({ ...prev, role: 'MANAGER' }))}
                  >
                    <span className="r-icon">👔</span>
                    <span className="r-name">Manager</span>
                  </button>
                  <button
                    type="button"
                    className={`role-pill ${registerData.role === 'DRIVER' ? 'active' : ''}`}
                    onClick={() => setRegisterData(prev => ({ ...prev, role: 'DRIVER' }))}
                  >
                    <span className="r-icon">🚚</span>
                    <span className="r-name">Driver</span>
                  </button>
                  <button
                    type="button"
                    className={`role-pill ${registerData.role === 'MECHANIC' ? 'active' : ''}`}
                    onClick={() => setRegisterData(prev => ({ ...prev, role: 'MECHANIC' }))}
                  >
                    <span className="r-icon">🔧</span>
                    <span className="r-name">Mechanic</span>
                  </button>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="reg-password">Password</label>
                  <div className="input-wrapper">
                    <input
                      id="reg-password"
                      name="password"
                      type="password"
                      placeholder="Min 6 chars"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-confirmpassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <input
                      id="reg-confirmpassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Repeat password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div id="register-error" className="error-message">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="success-message">
                  <span>✓ {successMsg}</span>
                </div>
              )}

              <button
                id="register-submit"
                type="submit"
                disabled={isLoading}
                className="login-button signup-btn"
              >
                {isLoading ? (
                  <span className="btn-loading-content">
                    <span className="spinner"></span> Persisting to H2 Database...
                  </span>
                ) : 'Create Account & Enter Portal'}
              </button>

              <div className="auth-switch-prompt">
                <span>Already have an account? </span>
                <button type="button" className="link-button" onClick={() => { setMode('signin'); setError(''); }}>
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* Optional Demo Auto-Fill Section (Collapsible helper) */}
          <div className="demo-collapsible">
            <button 
              type="button" 
              className="demo-toggle-btn"
              onClick={() => setShowDemoCreds(prev => !prev)}
            >
              <span>{showDemoCreds ? '▾ Hide pre-seeded demo accounts' : '▸ Need default demo accounts? (Click to view)'}</span>
            </button>

            {showDemoCreds && (
              <div className="demo-accounts-expanded">
                <div className="demo-buttons-grid">
                  <button
                    type="button"
                    className="demo-btn"
                    onClick={() => handleDemoSelect('manager1', 'manager123')}
                  >
                    <div className="demo-role-badge badge-manager">Manager</div>
                    <div className="demo-creds">manager1</div>
                  </button>
                  <button
                    type="button"
                    className="demo-btn"
                    onClick={() => handleDemoSelect('driver1', 'driver123')}
                  >
                    <div className="demo-role-badge badge-driver">Driver</div>
                    <div className="demo-creds">driver1</div>
                  </button>
                  <button
                    type="button"
                    className="demo-btn"
                    onClick={() => handleDemoSelect('mechanic1', 'mechanic123')}
                  >
                    <div className="demo-role-badge badge-mechanic">Mechanic</div>
                    <div className="demo-creds">mechanic1</div>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;