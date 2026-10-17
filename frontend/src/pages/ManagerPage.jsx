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
        <div className="nav-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          <span>OptiWheels</span>
          <span className="nav-brand-tag">Fleet Manager</span>
        </div>
        <span style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500, marginRight: '0.75rem' }}>
          {user?.fullName}
        </span>
        {TABS.map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
        <button className="logout" onClick={logout}>Sign Out</button>
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
  if (!data) return <p style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading operational metrics…</p>;

  const stats = [
    { label: 'Total Vehicles',        num: data.totalVehicles, color: '#2563eb' },
    { label: 'Active Vehicles',       num: data.activeVehicles, color: '#16a34a' },
    { label: 'In Maintenance',        num: data.vehiclesInMaintenance, color: '#d97706' },
    { label: 'Inactive Vehicles',     num: data.inactiveVehicles, color: '#64748b' },
    { label: 'Open Issues',           num: data.openMaintenance, color: '#ea580c' },
    { label: 'Assigned',              num: data.assignedMaintenance, color: '#4f46e5' },
    { label: 'In Progress',           num: data.inProgressMaintenance, color: '#0284c7' },
    { label: 'Completed',             num: data.completedMaintenance, color: '#16a34a' },
    { label: 'Closed Records',        num: data.closedMaintenance, color: '#64748b' },
  ];

  return (
    <>
      <h1 id="role-home-heading">Fleet Operations Dashboard</h1>
      <div className="stats-grid">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="num" style={{ color: s.color }}>{s.num}</div>
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
        setMsg('Vehicle updated successfully.');
      } else {
        await vehicleService.create(form, token);
        setMsg('Vehicle added to fleet successfully.');
      }
      setForm(null);
      load();
    } catch (ex) { setErr(ex.message); }
  };

  return (
    <>
      <h1>Fleet Vehicles</h1>
      {err && <p className="error">{err}</p>}
      {msg && <p className="success">{msg}</p>}

      <div className="search-bar">
        <input placeholder="Search by registration number, model, vehicle type…" value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => { setQuery(''); load(); }} style={{ background: '#64748b' }}>Clear</button>
        <button onClick={() => setForm({ registrationNumber:'', model:'', vehicleType:'', currentMileage:0, status:'ACTIVE' })}
          style={{ marginLeft:'auto', background:'#16a34a', color:'white' }}>
          + Add New Vehicle
        </button>
      </div>

      {form && (
        <form className="inline" onSubmit={handleSave}>
          <label>Registration Number
            <input required placeholder="e.g. KA-01-AB-1234" value={form.registrationNumber}
              onChange={e => setForm({...form, registrationNumber: e.target.value})} />
          </label>
          <label>Model
            <input required placeholder="e.g. Volvo FH16" value={form.model}
              onChange={e => setForm({...form, model: e.target.value})} />
          </label>
          <label>Type
            <input required placeholder="e.g. Heavy Truck" value={form.vehicleType}
              onChange={e => setForm({...form, vehicleType: e.target.value})} />
          </label>
          <label>Mileage (km)
            <input type="number" min="0" required value={form.currentMileage}
              onChange={e => setForm({...form, currentMileage: +e.target.value})} />
          </label>
          <label>Status
            <select value={form.status || 'ACTIVE'} onChange={e => setForm({...form, status: e.target.value})}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
            <button type="submit">{form.id ? 'Save Changes' : 'Create Vehicle'}</button>
            <button type="button" className="cancel" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Reg Number</th>
            <th>Model</th>
            <th>Type</th>
            <th>Mileage</th>
            <th>Operational Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v.id}>
              <td style={{ fontWeight: 600, color: '#0f172a' }}>{v.registrationNumber}</td>
              <td>{v.model}</td>
              <td>{v.vehicleType}</td>
              <td>{v.currentMileage?.toLocaleString()} km</td>
              <td><span className={`badge badge-${v.status}`}>{v.status}</span></td>
              <td>
                <button className="btn btn-primary" onClick={() => setForm({...v})}>Edit</button>
              </td>
            </tr>
          ))}
          {vehicles.length === 0 && (
            <tr><td colSpan={6} style={{textAlign:'center', padding: '2rem', color: '#64748b'}}>No vehicles found</td></tr>
          )}
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
      setMsg('Mechanic assigned successfully.');
      setAssignId(null); setMechUsername('');
      load();
    } catch (ex) { setErr(ex.message); }
  };

  const handleClose = async (id) => {
    setErr(''); setMsg('');
    try {
      await maintenanceService.close(id, token);
      setMsg('Maintenance record closed and archived.');
      load();
    } catch (ex) { setErr(ex.message); }
  };

  return (
    <>
      <h1>Maintenance Workflows</h1>
      {err && <p className="error">{err}</p>}
      {msg && <p className="success">{msg}</p>}

      <div className="search-bar">
        <input placeholder="Search maintenance records by description, vehicle reg…" value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => { setQuery(''); load(); }} style={{ background: '#64748b' }}>Clear</button>
      </div>

      {assignId && (
        <form className="inline" onSubmit={handleAssign}>
          <label>Assign to Mechanic (Username)
            <input required placeholder="e.g. mechanic1" value={mechUsername} onChange={e => setMechUsername(e.target.value)} />
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit">Confirm Assignment</button>
            <button type="button" className="cancel" onClick={() => setAssignId(null)}>Cancel</button>
          </div>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehicle Reg</th>
            <th>Issue Summary</th>
            <th>Type</th>
            <th>Current Status</th>
            <th>Reported By</th>
            <th>Assigned To</th>
            <th>Action</th>
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
              <td>{r.assignedTo ? <strong style={{ color: '#475569' }}>{r.assignedTo}</strong> : '—'}</td>
              <td>
                {r.status === 'OPEN' && (
                  <button className="btn btn-primary" onClick={() => { setAssignId(r.id); setMechUsername(''); }}>
                    Assign
                  </button>
                )}
                {r.status === 'COMPLETED' && (
                  <button className="btn btn-success" onClick={() => handleClose(r.id)}>
                    Sign & Close
                  </button>
                )}
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr><td colSpan={8} style={{textAlign:'center', padding: '2rem', color: '#64748b'}}>No maintenance records found</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}
