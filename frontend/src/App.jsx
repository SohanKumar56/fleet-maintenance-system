import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ManagerPage from './pages/ManagerPage';
import DriverPage from './pages/DriverPage';
import MechanicPage from './pages/MechanicPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/manager" element={
              <ProtectedRoute>
                <ManagerPage />
              </ProtectedRoute>
            } />
            <Route path="/driver" element={
              <ProtectedRoute>
                <DriverPage />
              </ProtectedRoute>
            } />
            <Route path="/mechanic" element={
              <ProtectedRoute>
                <MechanicPage />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;