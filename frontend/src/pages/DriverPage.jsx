import React from 'react';
import { useAuth } from '../context/AuthContext';

const DriverPage = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1 id="role-home-heading">Welcome, {user?.fullName} (DRIVER)</h1>
      <p>Driver dashboard placeholder - features will be implemented in later tasks.</p>
    </div>
  );
};

export default DriverPage;