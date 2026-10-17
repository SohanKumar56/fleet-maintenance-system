import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { maintenanceService } from '../services/maintenanceService';
import './shared.css';

export default function MechanicPage() {
  const { user, token, logout } = useAuth();
  const [records, setRecords] = useState([]);
  const [err, setErr]   = useState('');
  const [msg, setMsg]   = useState('');

  const load = () =>
    maintenanceService.myJobs(token).then(setRecords).catch(e => setErr(e.message));

  useEffect(() => { load(); }, [token]);

  const handleStart = async (id) => {
    setErr(''); setMsg('');
    try {
      await maintenanceService.start(id, token);
      setMsg('Job started.');
      load();
    } catch (ex) { setErr(ex.message); }
  };

  const handleComplete = async (id) => {
    setErr(''); setMsg('');
    try {
      await maintenanceService.complete(id, token);
      setMsg('Job marked as completed.');
      load();
    } catch (ex) { setErr(ex.message); }
  };

  return (
    <div className="page">
      <nav>
        <span style={{ fontWeight: 700, marginRight: '1rem' }}>
          OptiWheels — {user?.fullName}
        </span>
        <button className="logout" onClick={logout}>Logout</button>
      </nav>

      <h1 id="role-home-heading">Mechanic Portal</h1>
      <h2>My Assigned Jobs</h2>

      {err && <p className="error">{err}</p>}
      {msg && <p className="success">{msg}</p>}

      <table>
        <thead>
          <tr><th>ID</th><th>Vehicle</th><th>Issue</th><th>Type</th><th>Status</th><th>Reported By</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.vehicleRegistration}</td>
              <td>{r.issueDescription}</td>
              <td>{r.maintenanceType}</td>
              <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
              <td>{r.reportedBy}</td>
              <td style={{ display:'flex', gap:'0.3rem' }}>
                {r.status === 'ASSIGNED' && (
                  <button className="btn btn-warning" onClick={() => handleStart(r.id)}>Start Work</button>
                )}
                {r.status === 'IN_PROGRESS' && (
                  <button className="btn btn-success" onClick={() => handleComplete(r.id)}>Complete</button>
                )}
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr><td colSpan={7} style={{textAlign:'center'}}>No jobs assigned yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
