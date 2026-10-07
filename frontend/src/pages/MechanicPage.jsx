import React from 'react';
import { useAuth } from '../context/AuthContext';

const MechanicPage = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1 id="role-home-heading">Welcome, {user?.fullName} (MECHANIC)</h1>
      <p>Mechanic dashboard placeholder - features will be implemented in later tasks.</p>
    </div>
  );
};

export default MechanicPage;