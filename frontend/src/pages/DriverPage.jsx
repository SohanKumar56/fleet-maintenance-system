import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { vehicleService } from '../services/vehicleService';
import { maintenanceService } from '../services/maintenanceService';
import './shared.css';

const TABS = ['My Reports', 'Report Issue'];

export default function DriverPage() {
  const { user, token, logout } = useAuth();
  const [tab, setTab] = useState('My Reports');

  return (
    <div className="page">
      <nav>
        <span style={{ fontWeight: 700, marginRight: '1rem' }}>
          OptiWheels — {user?.fullName}
        </span>
        {TABS.map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
        <button className="logout" onClick={logout}>Logout</button>
      </nav>

      <h1 id="role-home-heading">Driver Portal</h1>
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
      <h2>My Maintenance Reports</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Vehicle</th><th>Issue</th><th>Type</th><th>Status</th><th>Assigned To</th><th>Date</th></tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.vehicleRegistration}</td>
              <td>{r.issueDescription}</td>
              <td>{r.maintenanceType}</td>
              <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
              <td>{r.assignedTo || '—'}</td>
              <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr><td colSpan={7} style={{textAlign:'center'}}>No reports yet</td></tr>
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

  useEffect(() => {
    vehicleService.getAll(token).then(setVehicles).catch(e => setErr(e.message));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    try {
      await maintenanceService.create({ ...form, vehicleId: +form.vehicleId }, token);
      setMsg('Report submitted successfully.');
      setTimeout(onDone, 1500);
    } catch (ex) { setErr(ex.message); }
  };

  return (
    <>
      <h2>Report a Vehicle Issue</h2>
      {err && <p className="error">{err}</p>}
      {msg && <p className="success">{msg}</p>}

      <form className="inline" onSubmit={handleSubmit} style={{ flexDirection:'column', alignItems:'stretch', maxWidth:'480px' }}>
        <label>Vehicle
          <select required value={form.vehicleId}
            onChange={e => setForm({...form, vehicleId: e.target.value})}>
            <option value="">— Select vehicle —</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.registrationNumber} — {v.model}</option>
            ))}
          </select>
        </label>
        <label>Maintenance Type
          <select value={form.maintenanceType}
            onChange={e => setForm({...form, maintenanceType: e.target.value})}>
            <option>PREVENTIVE</option>
            <option>CORRECTIVE</option>
            <option>EMERGENCY</option>
          </select>
        </label>
        <label>Issue Description
          <textarea required rows={4} value={form.issueDescription}
            onChange={e => setForm({...form, issueDescription: e.target.value})}
            placeholder="Describe the issue…" />
        </label>
        <button type="submit">Submit Report</button>
      </form>
    </>
  );
}
