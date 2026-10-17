import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vehicleService } from '../services/vehicleService';
import { maintenanceService } from '../services/maintenanceService';
import './shared.css';

const TABS = ['My Reports', 'Report Issue'];

export default function DriverPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('My Reports');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page">
      <nav>
        <div className="nav-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          <span>OptiWheels</span>
          <span className="nav-brand-tag" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>
            Driver Portal
          </span>
        </div>
        <span style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500, marginRight: '0.75rem' }}>
          {user?.fullName}
        </span>
        {TABS.map(t => (
          <button
            key={t}
            id={t === 'My Reports' ? 'tab-my-reports' : 'tab-report-issue'}
            className={tab === t ? 'active' : ''}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
        <button id="btn-driver-logout" className="logout" onClick={handleLogout}>Sign Out</button>
      </nav>

      <h1 id="role-home-heading">Driver Operations</h1>
      {tab === 'My Reports'   && <MyReports token={token} />}
      {tab === 'Report Issue' && <ReportIssue token={token} onDone={() => setTab('My Reports')} />}
    </div>
  );
}

function MyReports({ token }) {
  const [records, setRecords] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    maintenanceService.myReports(token)
      .then(setRecords)
      .catch(e => setErr(e.message));
  }, [token]);

  if (err) return <p className="error">{err}</p>;

  return (
    <>
      <h2>My Reported Issues & Maintenance History</h2>
      <table>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Assigned Vehicle</th>
            <th>Defect / Issue</th>
            <th>Type</th>
            <th>Status</th>
            <th>Assigned Mechanic</th>
            <th>Date Reported</th>
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
              <td>{r.assignedTo ? <strong style={{ color: '#475569' }}>{r.assignedTo}</strong> : 'Pending Review'}</td>
              <td style={{ color: '#64748b' }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr><td colSpan={7} style={{textAlign:'center', padding: '2rem', color: '#64748b'}}>No maintenance tickets reported yet</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}

function ReportIssue({ token, onDone }) {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ vehicleId: '', issueDescription: '', maintenanceType: 'CORRECTIVE' });
  const [err, setErr]   = useState('');
  const [msg, setMsg]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    vehicleService.getAll(token).then(setVehicles).catch(e => setErr(e.message));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    setSubmitting(true);
    const formData = new FormData(e.target);
    const payload = {
      vehicleId: +(formData.get('vehicleId') || form.vehicleId),
      maintenanceType: formData.get('maintenanceType') || form.maintenanceType || 'CORRECTIVE',
      issueDescription: formData.get('issueDescription') || form.issueDescription
    };
    try {
      await maintenanceService.create(payload, token);
      setMsg('Maintenance report submitted successfully! Redirecting…');
      setTimeout(onDone, 1200);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px' }}>
      <h2>Log New Vehicle Defect or Maintenance Request</h2>
      {err && <p className="error">{err}</p>}
      {msg && <p className="success">{msg}</p>}

      <form className="inline" onSubmit={handleSubmit} style={{ flexDirection:'column', alignItems:'stretch' }}>
        <label>Select Fleet Vehicle
          <select id="select-vehicle" name="vehicleId" required value={form.vehicleId}
            onChange={e => setForm(prev => ({...prev, vehicleId: e.target.value}))}>
            <option value="">— Choose a vehicle from fleet —</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.registrationNumber} — {v.model} ({v.vehicleType})</option>
            ))}
          </select>
        </label>
        
        <label>Maintenance Urgency & Type
          <select id="select-maintenance-type" name="maintenanceType" value={form.maintenanceType}
            onChange={e => setForm(prev => ({...prev, maintenanceType: e.target.value}))}>
            <option value="PREVENTIVE">PREVENTIVE (Scheduled Service / Inspection)</option>
            <option value="CORRECTIVE">CORRECTIVE (Repair / Fault Fix)</option>
            <option value="EMERGENCY">EMERGENCY (Critical Breakdown)</option>
          </select>
        </label>

        <label>Detailed Issue Description
          <textarea id="textarea-issue-desc" name="issueDescription" required rows={4} value={form.issueDescription}
            onChange={e => setForm(prev => ({...prev, issueDescription: e.target.value}))}
            placeholder="Please detail abnormal noises, warning indicators, brake/steering issues, fluid leaks…" />
        </label>
        
        <button id="btn-submit-defect" type="submit" disabled={submitting} style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
          {submitting ? 'Submitting…' : 'Submit Defect Report'}
        </button>
      </form>
    </div>
  );
}
