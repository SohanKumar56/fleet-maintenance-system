import React from 'react';
import { useAuth } from '../context/AuthContext';

const ManagerPage = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1 id="role-home-heading">Welcome, {user?.fullName} (MANAGER)</h1>
      <p>Manager dashboard placeholder - features will be implemented in later tasks.</p>
    </div>
  );
};

export default ManagerPage;