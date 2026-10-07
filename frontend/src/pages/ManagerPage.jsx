import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { vehicleService } from '../services/vehicleService';
import { maintenanceService } from '../services/maintenanceService';
import './shared.css';

const TABS = ['Dashboard', 'Vehicles', 'Maintenance'];

export default function ManagerPage() {
  const { user, token, logout } = useAuth();
  const [tab, setTab] = useState('Dashboard');

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

      {tab === 'Dashboard' && <Dashboard token={token} />}
      {tab === 'Vehicles'  && <Vehicles token={token} />}
      {tab === 'Maintenance' && <Maintenance token={token} />}
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────
function Dashboard({ token }) {
  const [data, setData] = useState(null);
  const [err, setErr]   = useState('');

  useEffect(() => {
    maintenanceService.getDashboard(token)
      .then(setData)
      .catch(e => setErr(e.message));
  }, [token]);

  if (err) return <p className="error">{err}</p>;
  if (!data) return <p>Loading…</p>;

  const stats = [
    { label: 'Total Vehicles',        num: data.totalVehicles },
    { label: 'Active Vehicles',       num: data.activeVehicles },
    { label: 'In Maintenance',        num: data.vehiclesInMaintenance },
    { label: 'Inactive Vehicles',     num: data.inactiveVehicles },
    { label: 'Open Issues',           num: data.openMaintenance },
    { label: 'Assigned',              num: data.assignedMaintenance },
    { label: 'In Progress',           num: data.inProgressMaintenance },
    { label: 'Completed',             num: data.completedMaintenance },
    { label: 'Closed',                num: data.closedMaintenance },
  ];

  return (
    <>
      <h1 id="role-home-heading">Fleet Dashboard</h1>
      <div className="stats-grid">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="num">{s.num}</div>
            <div className="label">{s.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Vehicles ─────────────────────────────────────────────
function Vehicles({ token }) {
  const [vehicles, setVehicles] = useState([]);
  const [query, setQuery]       = useState('');
  const [form, setForm]         = useState(null); // null = hidden, {} = new, {id,...} = edit
  const [err, setErr]           = useState('');
  const [msg, setMsg]           = useState('');

  const load = () => vehicleService.getAll(token).then(setVehicles).catch(e => setErr(e.message));
  useEffect(() => { load(); }, [token]);

  const handleSearch = () => {
    if (!query.trim()) { load(); return; }
    vehicleService.search(query, token).then(setVehicles).catch(e => setErr(e.message));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    try {
      if (form.id) {
        await vehicleService.update(form.id, form, token);
        setMsg('Vehicle updated.');
      } else {
        await vehicleService.create(form, token);
        setMsg('Vehicle created.');
      }
      setForm(null);
      load();
    } catch (ex) { setErr(ex.message); }
  };

  return (
    <>
      <h1>Vehicles</h1>
      {err && <p className="error">{err}</p>}
      {msg && <p className="success">{msg}</p>}

      <div className="search-bar">
        <input placeholder="Search by reg, model, type…" value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => { setQuery(''); load(); }}>Clear</button>
        <button onClick={() => setForm({ registrationNumber:'', model:'', vehicleType:'', currentMileage:0, status:'ACTIVE' })}
          style={{ marginLeft:'auto', background:'#28a745', color:'white', border:'none', borderRadius:'4px', padding:'0.4rem 0.8rem', cursor:'pointer' }}>
          + New Vehicle
        </button>
      </div>

      {form && (
        <form className="inline" onSubmit={handleSave} style={{ background:'#f9f9f9', padding:'1rem', borderRadius:'6px', marginBottom:'1rem' }}>
          <label>Reg No<input required value={form.registrationNumber}
            onChange={e => setForm({...form, registrationNumber: e.target.value})} /></label>
          <label>Model<input required value={form.model}
            onChange={e => setForm({...form, model: e.target.value})} /></label>
          <label>Type<input required value={form.vehicleType}
            onChange={e => setForm({...form, vehicleType: e.target.value})} /></label>
          <label>Mileage<input type="number" min="0" required value={form.currentMileage}
            onChange={e => setForm({...form, currentMileage: +e.target.value})} /></label>
          <label>Status
            <select value={form.status || 'ACTIVE'} onChange={e => setForm({...form, status: e.target.value})}>
              <option>ACTIVE</option><option>MAINTENANCE</option><option>INACTIVE</option>
            </select>
          </label>
          <button type="submit">{form.id ? 'Update' : 'Create'}</button>
          <button type="button" className="cancel" onClick={() => setForm(null)}>Cancel</button>
        </form>
      )}

      <table>
        <thead><tr><th>Reg No</th><th>Model</th><th>Type</th><th>Mileage</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v.id}>
              <td>{v.registrationNumber}</td>
              <td>{v.model}</td>
              <td>{v.vehicleType}</td>
              <td>{v.currentMileage}</td>
              <td><span className={`badge badge-${v.status}`}>{v.status}</span></td>
              <td><button className="btn btn-primary" onClick={() => setForm({...v})}>Edit</button></td>
            </tr>
          ))}
          {vehicles.length === 0 && <tr><td colSpan={6} style={{textAlign:'center'}}>No vehicles found</td></tr>}
        </tbody>
      </table>
    </>
  );
}

// ── Maintenance ───────────────────────────────────────────
function Maintenance({ token }) {
  const [records, setRecords] = useState([]);
  const [query, setQuery]     = useState('');
  const [assignId, setAssignId] = useState(null);
  const [mechUsername, setMechUsername] = useState('');
  const [err, setErr]   = useState('');
  const [msg, setMsg]   = useState('');

  const load = () => maintenanceService.getAll(token).then(setRecords).catch(e => setErr(e.message));
  useEffect(() => { load(); }, [token]);

  const handleSearch = () => {
    if (!query.trim()) { load(); return; }
    maintenanceService.search(query, token).then(setRecords).catch(e => setErr(e.message));
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    try {
      await maintenanceService.assign(assignId, mechUsername, token);
      setMsg('Mechanic assigned.');
      setAssignId(null); setMechUsername('');
      load();
    } catch (ex) { setErr(ex.message); }
  };

  const handleClose = async (id) => {
    setErr(''); setMsg('');
    try {
      await maintenanceService.close(id, token);
      setMsg('Record closed.');
      load();
    } catch (ex) { setErr(ex.message); }
  };

  return (
    <>
      <h1>Maintenance Records</h1>
      {err && <p className="error">{err}</p>}
      {msg && <p className="success">{msg}</p>}

      <div className="search-bar">
        <input placeholder="Search…" value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => { setQuery(''); load(); }}>Clear</button>
      </div>

      {assignId && (
        <form className="inline" onSubmit={handleAssign}
          style={{ background:'#f9f9f9', padding:'1rem', borderRadius:'6px', marginBottom:'1rem' }}>
          <label>Mechanic username
            <input required value={mechUsername} onChange={e => setMechUsername(e.target.value)} />
          </label>
          <button type="submit">Assign</button>
          <button type="button" className="cancel" onClick={() => setAssignId(null)}>Cancel</button>
        </form>
      )}

      <table>
        <thead>
          <tr><th>ID</th><th>Vehicle</th><th>Issue</th><th>Type</th><th>Status</th><th>Reported By</th><th>Assigned To</th><th>Actions</th></tr>
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
              <td>{r.assignedTo || '—'}</td>
              <td style={{ display:'flex', gap:'0.3rem' }}>
                {r.status === 'OPEN' && (
                  <button className="btn btn-primary" onClick={() => { setAssignId(r.id); setMechUsername(''); }}>Assign</button>
                )}
                {r.status === 'COMPLETED' && (
                  <button className="btn btn-success" onClick={() => handleClose(r.id)}>Close</button>
                )}
              </td>
            </tr>
          ))}
          {records.length === 0 && <tr><td colSpan={8} style={{textAlign:'center'}}>No records found</td></tr>}
        </tbody>
      </table>
    </>
  );
}
