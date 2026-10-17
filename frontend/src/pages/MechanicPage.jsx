import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { maintenanceService } from '../services/maintenanceService';
import './shared.css';

export default function MechanicPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [err, setErr]   = useState('');
  const [msg, setMsg]   = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const load = () =>
    maintenanceService.myJobs(token).then(setRecords).catch(e => setErr(e.message));

  useEffect(() => { load(); }, [token]);

  const handleStart = async (id) => {
    setErr(''); setMsg('');
    try {
      await maintenanceService.start(id, token);
      setMsg(`Work order #${id} started (Status: IN_PROGRESS).`);
      load();
    } catch (ex) { setErr(ex.message); }
  };

  const handleComplete = async (id) => {
    setErr(''); setMsg('');
    try {
      await maintenanceService.complete(id, token);
      setMsg(`Work order #${id} completed successfully.`);
      load();
    } catch (ex) { setErr(ex.message); }
  };

  return (
    <div className="page">
      <nav>
        <div className="nav-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
          <span>OptiWheels</span>
          <span className="nav-brand-tag" style={{ background: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe' }}>
            Technician Portal
          </span>
        </div>
        <span style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500, marginRight: '0.75rem' }}>
          {user?.fullName}
        </span>
        <button id="btn-mechanic-logout" className="logout" onClick={handleLogout}>Sign Out</button>
      </nav>

      <h1 id="role-home-heading">Technician Work Orders</h1>
      <h2>My Assigned Repair & Service Jobs</h2>

      {err && <p className="error">{err}</p>}
      {msg && <p className="success">{msg}</p>}

      <table>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Vehicle Reg</th>
            <th>Fault / Description</th>
            <th>Service Type</th>
            <th>Progress Status</th>
            <th>Reported By</th>
            <th>Workflow Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id}>
              <td style={{ fontWeight: 600 }}>#{r.id}</td>
              <td style={{ fontWeight: 600, color: '#2563eb' }}>{r.vehicleRegistration}</td>
              <td>{r.issueDescription}</td>
              <td>{r.maintenanceType}</td>
              <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
              <td>{r.reportedBy}</td>
              <td style={{ display:'flex', gap:'0.4rem' }}>
                {r.status === 'ASSIGNED' && (
                  <button className="btn btn-warning" onClick={() => handleStart(r.id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Start Work
                  </button>
                )}
                {r.status === 'IN_PROGRESS' && (
                  <button className="btn btn-success" onClick={() => handleComplete(r.id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Mark Complete
                  </button>
                )}
                {r.status === 'COMPLETED' && (
                  <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                    Awaiting Manager Sign-off
                  </span>
                )}
                {r.status === 'CLOSED' && (
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Archived
                  </span>
                )}
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr><td colSpan={7} style={{textAlign:'center', padding: '2rem', color: '#64748b'}}>No jobs currently assigned to you</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
