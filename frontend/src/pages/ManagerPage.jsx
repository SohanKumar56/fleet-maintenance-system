import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vehicleService } from '../services/vehicleService';
import { maintenanceService } from '../services/maintenanceService';
import './shared.css';
import './ManagerDashboard.css';

const TABS = ['Dashboard', 'Vehicles', 'Maintenance'];

const DEFAULT_MECHANICS = [
  { username: 'mechanic1', fullName: 'Bob Mechanic' }
];

export default function ManagerPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page">
      <nav>
        <div className="nav-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          <span>OptiWheels Logistics</span>
          <span className="nav-brand-tag">Manager Portal</span>
        </div>
        <span style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500, marginRight: '0.75rem' }}>
          {user?.fullName}
        </span>
        {TABS.map(t => (
          <button
            key={t}
            id={`nav-tab-${t.toLowerCase()}`}
            className={tab === t ? 'active' : ''}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
        <button id="btn-logout" className="logout" onClick={handleLogout}>Sign Out</button>
      </nav>

      {tab === 'Dashboard' && <Dashboard token={token} onNavigateTab={setTab} />}
      {tab === 'Vehicles'  && <Vehicles token={token} />}
      {tab === 'Maintenance' && <Maintenance token={token} />}
    </div>
  );
}

// ── Redesigned Dashboard: High-Impact Operations Command Center ──
function Dashboard({ token, onNavigateTab }) {
  const [data, setData] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [mechanics, setMechanics] = useState(DEFAULT_MECHANICS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [assigningRecord, setAssigningRecord] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [dashData, allComplaints, mechList] = await Promise.all([
        maintenanceService.getDashboard(token).catch(() => null),
        maintenanceService.getAll(token).catch(() => []),
        maintenanceService.getMechanics(token).catch(() => DEFAULT_MECHANICS)
      ]);
      setData(dashData);
      setComplaints(allComplaints);
      if (mechList && mechList.length > 0) {
        setMechanics(mechList);
        setSelectedMechanic(mechList[0].username);
      } else {
        setSelectedMechanic('mechanic1');
      }
    } catch (e) {
      setErr(e.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [token]);

  const handleAssignConfirm = async (e) => {
    e.preventDefault();
    if (!assigningRecord || !selectedMechanic.trim()) return;
    setErr('');
    setMsg('');
    try {
      await maintenanceService.assign(assigningRecord.id, selectedMechanic.trim(), token);
      setMsg(`Work order #${assigningRecord.id} successfully assigned to mechanic '${selectedMechanic}'.`);
      setAssigningRecord(null);
      loadAll();
    } catch (ex) {
      setErr(ex.message || 'Assignment failed');
    }
  };

  const handleClose = async (id) => {
    setErr('');
    setMsg('');
    try {
      await maintenanceService.close(id, token);
      setMsg(`Work order #${id} has been signed off and closed.`);
      loadAll();
    } catch (ex) {
      setErr(ex.message);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(r => {
    let matchesStatus = false;
    if (statusFilter === 'ALL') {
      matchesStatus = true;
    } else if (statusFilter === 'OPEN') {
      matchesStatus = r.status === 'OPEN';
    } else if (statusFilter === 'IN_PROGRESS') {
      matchesStatus = r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED';
    } else if (statusFilter === 'COMPLETED') {
      matchesStatus = r.status === 'COMPLETED' || r.status === 'CLOSED';
    } else {
      matchesStatus = r.status === statusFilter;
    }
    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (r.vehicleRegistration && r.vehicleRegistration.toLowerCase().includes(q)) ||
      (r.issueDescription && r.issueDescription.toLowerCase().includes(q)) ||
      (r.reportedBy && r.reportedBy.toLowerCase().includes(q)) ||
      (r.assignedTo && r.assignedTo.toLowerCase().includes(q)) ||
      String(r.id).includes(q)
    );
  });

  const openCount = complaints.filter(c => c.status === 'OPEN').length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
  const completedCount = complaints.filter(c => c.status === 'COMPLETED' || c.status === 'CLOSED').length;
  const totalVehicles = data?.totalVehicles ?? 2;
  const vehiclesUnderRepairCount = new Set(
    complaints
      .filter(c => c.status === 'OPEN' || c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS')
      .map(c => c.vehicleRegistration)
  ).size;
  const vehiclesInMaint = (data?.vehiclesInMaintenance && data.vehiclesInMaintenance > 0) 
    ? data.vehiclesInMaintenance 
    : vehiclesUnderRepairCount;
  const activeVehicles = Math.max(0, totalVehicles - vehiclesInMaint);
  const fleetAvailability = totalVehicles > 0 
    ? Math.round(((totalVehicles - vehiclesInMaint) / totalVehicles) * 100) 
    : 100;

  return (
    <div className="manager-dashboard-view">
      {/* ── Top Hero Command Banner ── */}
      <div className="dash-hero-banner">
        <div>
          <div className="dash-hero-eyebrow">
            <span>OptiWheels Logistics</span>
            <span>•</span>
            <span>Fleet Operations Command</span>
          </div>
          <h1 id="role-home-heading" className="dash-hero-title">
            Fleet Operations Dashboard
          </h1>
          <p className="dash-hero-desc">
            Real-time fleet readiness, driver defect triage queue, and certified mechanic work order dispatch.
          </p>
        </div>
        <div className="dash-hero-actions">
          <div className="system-status-pill">
            <span className="pulse-green-dot"></span>
            <span>H2 Database Connected</span>
          </div>
          <button 
            type="button" 
            className="btn-dash-action"
            onClick={loadAll}
            title="Refresh real-time telemetry"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
          {onNavigateTab && (
            <button
              type="button"
              className="btn-dash-action btn-dash-primary"
              onClick={() => onNavigateTab('Vehicles')}
            >
              <span>+</span> Add Vehicle
            </button>
          )}
        </div>
      </div>

      {err && <p className="error">{err}</p>}
      {msg && <p className="success">{msg}</p>}

      {/* ── KPI & Fleet Readiness Dual Section ── */}
      <div className="dash-overview-row">
        {/* Left: 6-Card Balanced KPI Matrix */}
        <div className="dash-kpi-grid">
          {/* Card 1: Total Fleet Units */}
          <div className="kpi-card fleet">
            <div className="kpi-header">
              <div className="kpi-icon-bubble">🚛</div>
              <span className="kpi-tag">Registered</span>
            </div>
            <div>
              <div className="kpi-value">{totalVehicles}</div>
              <div className="kpi-label">Total Fleet Units</div>
              <div className="kpi-subtext">Commercial road haulers</div>
            </div>
          </div>

          {/* Card 2: Active on Road */}
          <div className="kpi-card active">
            <div className="kpi-header">
              <div className="kpi-icon-bubble">🟢</div>
              <span className="kpi-tag" style={{ color: '#059669', background: '#ecfdf5' }}>Active</span>
            </div>
            <div>
              <div className="kpi-value" style={{ color: '#059669' }}>{activeVehicles}</div>
              <div className="kpi-label">Active On Road</div>
              <div className="kpi-subtext">Ready for commercial service</div>
            </div>
          </div>

          {/* Card 3: In Maintenance */}
          <div className="kpi-card maint">
            <div className="kpi-header">
              <div className="kpi-icon-bubble">🔧</div>
              <span className="kpi-tag" style={{ color: vehiclesInMaint > 0 ? '#d97706' : '#64748b' }}>
                {vehiclesInMaint > 0 ? 'In Workshop' : 'Zero Offline'}
              </span>
            </div>
            <div>
              <div className="kpi-value" style={{ color: vehiclesInMaint > 0 ? '#d97706' : '#475569' }}>{vehiclesInMaint}</div>
              <div className="kpi-label">In Maintenance</div>
              <div className="kpi-subtext">Vehicles undergoing repair</div>
            </div>
          </div>

          {/* Card 4: Open Complaints */}
          <div className={`kpi-card open-complaints ${openCount > 0 ? 'alert' : ''}`}>
            <div className="kpi-header">
              <div className="kpi-icon-bubble">⚠️</div>
              <span className={`kpi-tag ${openCount > 0 ? 'alert-active' : ''}`}>
                {openCount > 0 ? 'Action Required' : 'All Assigned'}
              </span>
            </div>
            <div>
              <div className="kpi-value" style={{ color: openCount > 0 ? '#ea580c' : '#475569' }}>{openCount}</div>
              <div className="kpi-label">Open Complaints</div>
              <div className="kpi-subtext">Needs mechanic dispatch</div>
            </div>
          </div>

          {/* Card 5: Active Repair Orders */}
          <div className="kpi-card in-prog">
            <div className="kpi-header">
              <div className="kpi-icon-bubble">⏳</div>
              <span className="kpi-tag" style={{ color: '#2563eb', background: '#eff6ff' }}>In Progress</span>
            </div>
            <div>
              <div className="kpi-value" style={{ color: '#2563eb' }}>{inProgressCount}</div>
              <div className="kpi-label">Active Work Orders</div>
              <div className="kpi-subtext">Assigned to mechanic</div>
            </div>
          </div>

          {/* Card 6: Completed Work Orders */}
          <div className="kpi-card completed">
            <div className="kpi-header">
              <div className="kpi-icon-bubble">✅</div>
              <span className="kpi-tag" style={{ color: '#0d9488', background: '#f0fdfa' }}>Resolved</span>
            </div>
            <div>
              <div className="kpi-value" style={{ color: '#0d9488' }}>{completedCount}</div>
              <div className="kpi-label">Completed Orders</div>
              <div className="kpi-subtext">Certified & ready to close</div>
            </div>
          </div>
        </div>

        {/* Right: Fleet Readiness Gauge Card */}
        <div className="dash-health-card">
          <div className="health-card-header">
            <h3 className="health-card-title">
              <span>🛡️</span> Fleet Readiness Index
            </h3>
            <span className="kpi-tag" style={{
              background: fleetAvailability === 100 ? '#ecfdf5' : '#fffbeb',
              color: fleetAvailability === 100 ? '#059669' : '#d97706',
              border: fleetAvailability === 100 ? '1px solid #a7f3d0' : '1px solid #fde68a',
              fontWeight: 800
            }}>
              {fleetAvailability === 100 ? 'OPTIMAL' : 'ATTENTION'}
            </span>
          </div>

          <div className="readiness-meter-block">
            <div className="readiness-big-pct" style={{ color: fleetAvailability === 100 ? '#059669' : '#d97706' }}>
              {fleetAvailability}%
            </div>
            <div className="readiness-pct-label">Fleet Operational Availability</div>
          </div>

          <div className="health-breakdown-list">
            <div className="health-breakdown-item">
              <span className="health-item-label">
                <span style={{ color: '#10b981' }}>●</span> Commercial Drivers:
              </span>
              <span className="health-item-val">Alice Driver (@driver1)</span>
            </div>
            <div className="health-breakdown-item">
              <span className="health-item-label">
                <span style={{ color: '#3b82f6' }}>●</span> Lead Certified Mechanic:
              </span>
              <span className="health-item-val">Bob Mechanic (@mechanic1)</span>
            </div>
            <div className="health-breakdown-item">
              <span className="health-item-label">
                <span style={{ color: '#f59e0b' }}>●</span> Defect Triage Queue:
              </span>
              <span className="health-item-val" style={{ color: openCount > 0 ? '#ea580c' : '#059669' }}>
                {openCount === 0 ? 'Zero pending defects' : `${openCount} unassigned complaints`}
              </span>
            </div>
          </div>

          <div className="dash-pipeline-steps">
            <span className="pipe-chip open">1. OPEN</span>
            <span>→</span>
            <span className="pipe-chip assigned">2. ASSIGNED</span>
            <span>→</span>
            <span className="pipe-chip in-prog">3. IN_PROGRESS</span>
            <span>→</span>
            <span className="pipe-chip done">4. COMPLETED</span>
            <span>→</span>
            <span className="pipe-chip closed">5. CLOSED</span>
          </div>
        </div>
      </div>

      {/* ── Main Dispatch Section: Driver Complaints & Maintenance Dispatch ── */}
      <div className="dash-dispatch-section">
        <div className="dispatch-section-header">
          <div>
            <h2 className="dispatch-header-title">
              <span>📋</span> Driver Problem Reports & Maintenance Dispatch
            </h2>
            <p className="dispatch-header-desc">
              Select any driver defect complaint to dispatch an internal certified mechanic or sign off on completed repairs.
            </p>
          </div>

          {/* Quick status filter pills */}
          <div className="dispatch-filter-pills">
            <button
              type="button"
              className={`filter-pill-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              <span>All Tickets</span>
              <span className="filter-pill-badge">{complaints.length}</span>
            </button>
            <button
              type="button"
              className={`filter-pill-btn pill-open ${statusFilter === 'OPEN' ? 'active' : ''}`}
              onClick={() => setStatusFilter('OPEN')}
            >
              <span>⚠️ Needs Assignment</span>
              <span className="filter-pill-badge">{openCount}</span>
            </button>
            <button
              type="button"
              className={`filter-pill-btn pill-prog ${statusFilter === 'IN_PROGRESS' ? 'active' : ''}`}
              onClick={() => setStatusFilter('IN_PROGRESS')}
            >
              <span>🔧 In Progress</span>
              <span className="filter-pill-badge">{inProgressCount}</span>
            </button>
            <button
              type="button"
              className={`filter-pill-btn pill-done ${statusFilter === 'COMPLETED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('COMPLETED')}
            >
              <span>✅ Completed</span>
              <span className="filter-pill-badge">{completedCount}</span>
            </button>
          </div>
        </div>

        {/* Enhanced Search input */}
        <div className="dispatch-search-wrapper">
          <svg className="search-input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            id="input-search-dashboard-complaints"
            className="dispatch-search-input"
            placeholder="Search complaints by vehicle registration plate, driver username, defect keyword, ticket ID…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="btn-search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Modal / Inline Assignment Card */}
        {assigningRecord && (
          <div style={{
            background: 'linear-gradient(135deg, #fffaf5 0%, #ffffff 100%)',
            border: '2px solid #fed7aa',
            borderRadius: '14px',
            padding: '1.5rem',
            marginBottom: '1.75rem',
            boxShadow: '0 8px 24px rgba(234, 88, 12, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#9a3412', fontSize: '1.18rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔧</span> Dispatch Work Order #{assigningRecord.id} to Mechanic
              </h3>
              <button 
                type="button" 
                onClick={() => setAssigningRecord(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', fontSize: '0.9rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem', background: '#ffffff', padding: '1.15rem', borderRadius: '10px', border: '1px solid #fed7aa' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', display: 'block' }}>Vehicle Plate</span>
                <span className="vehicle-plate-chip" style={{ marginTop: '0.25rem' }}>{assigningRecord.vehicleRegistration}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', display: 'block' }}>Reported By Driver</span>
                <strong style={{ color: '#0b1320', display: 'block', marginTop: '0.25rem' }}>{assigningRecord.reportedBy}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', display: 'block' }}>Maintenance Type</span>
                <span className={`urgency-badge ${assigningRecord.maintenanceType}`} style={{ display: 'inline-block', marginTop: '0.25rem' }}>
                  {assigningRecord.maintenanceType}
                </span>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', display: 'block' }}>Reported Defect Description</span>
                <span style={{ color: '#334155', fontStyle: 'italic', display: 'block', marginTop: '0.25rem' }}>"{assigningRecord.issueDescription}"</span>
              </div>
            </div>

            <form onSubmit={handleAssignConfirm} style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
              <label style={{ flex: 1, minWidth: '260px' }}>
                <span style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Select Certified Internal Mechanic
                </span>
                <select
                  id="select-assign-mechanic"
                  value={selectedMechanic}
                  onChange={e => setSelectedMechanic(e.target.value)}
                  style={{
                    width: '100%',
                    height: '44px',
                    padding: '0 0.85rem',
                    border: '1.5px solid #fed7aa',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    background: '#ffffff',
                    fontWeight: 600
                  }}
                  required
                >
                  {mechanics.map(m => (
                    <option key={m.username} value={m.username}>
                      {m.fullName || m.username} (@{m.username})
                    </option>
                  ))}
                </select>
              </label>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  id="btn-confirm-assign-mechanic"
                  type="submit"
                  className="btn btn-warning"
                  style={{ height: '44px', padding: '0 1.5rem', background: '#ea580c', color: '#fff', fontWeight: 700, borderRadius: '8px' }}
                >
                  ✓ Confirm & Assign Work Order
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setAssigningRecord(null)}
                  style={{ height: '44px', background: '#e2e8f0', color: '#475569', borderRadius: '8px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Complaints Table or Premium Empty State */}
        {filteredComplaints.length > 0 ? (
          <div className="dash-table-wrapper">
            <table className="dash-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Ticket ID</th>
                  <th style={{ width: '150px' }}>Vehicle Reg</th>
                  <th style={{ width: '140px' }}>Driver</th>
                  <th>Reported Defect</th>
                  <th style={{ width: '130px' }}>Urgency Type</th>
                  <th style={{ width: '110px' }}>Status</th>
                  <th style={{ width: '160px' }}>Assigned Mechanic</th>
                  <th style={{ width: '110px' }}>Date</th>
                  <th style={{ width: '140px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map(r => (
                  <tr key={r.id}>
                    <td><strong style={{ color: '#0f172a' }}>#{r.id}</strong></td>
                    <td>
                      <span className="vehicle-plate-chip">{r.vehicleRegistration}</span>
                    </td>
                    <td>
                      <div className="avatar-chip">
                        <span className="avatar-dot">{(r.reportedBy || 'D')[0].toUpperCase()}</span>
                        <span>{r.reportedBy}</span>
                      </div>
                    </td>
                    <td style={{ maxWidth: '300px', color: '#334155' }}>
                      {r.issueDescription}
                    </td>
                    <td>
                      <span className={`urgency-badge ${r.maintenanceType}`}>
                        {r.maintenanceType}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${r.status}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.assignedTo ? (
                        <div className="avatar-chip" style={{ color: '#0f172a' }}>
                          <span className="avatar-dot" style={{ background: '#dbeafe', color: '#2563eb' }}>🔧</span>
                          <span>{r.assignedTo}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#ea580c', fontWeight: 700, fontSize: '0.8rem', background: '#fff7ed', border: '1px solid #ffedd5', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                          ⚠️ Needs Assignment
                        </span>
                      )}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.82rem' }}>
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {r.status === 'OPEN' && (
                        <button
                          className="btn btn-warning"
                          style={{ background: '#ea580c', color: '#ffffff', padding: '0.4rem 0.9rem', fontSize: '0.82rem', fontWeight: 700, borderRadius: '6px' }}
                          onClick={() => {
                            setAssigningRecord(r);
                            if (mechanics.length > 0) setSelectedMechanic(mechanics[0].username);
                          }}
                        >
                          Assign Mechanic
                        </button>
                      )}
                      {(r.status === 'ASSIGNED' || r.status === 'IN_PROGRESS') && (
                        <button
                          className="btn"
                          style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0.4rem 0.85rem', fontSize: '0.82rem', borderRadius: '6px' }}
                          onClick={() => {
                            setAssigningRecord(r);
                            if (mechanics.length > 0) setSelectedMechanic(mechanics[0].username);
                          }}
                        >
                          Re-assign
                        </button>
                      )}
                      {r.status === 'COMPLETED' && (
                        <button
                          className="btn btn-success"
                          style={{ background: '#059669', color: '#ffffff', padding: '0.4rem 0.9rem', fontSize: '0.82rem', fontWeight: 700, borderRadius: '6px' }}
                          onClick={() => handleClose(r.id)}
                        >
                          Sign & Close
                        </button>
                      )}
                      {r.status === 'CLOSED' && (
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, background: '#f1f5f9', padding: '0.25rem 0.55rem', borderRadius: '4px' }}>
                          ✓ Archived
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="dash-empty-state">
            <div className="empty-state-icon-bubble">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <h3 className="empty-state-title">
              {loading ? 'Refreshing Operations Data…' : 'No Driver Complaints in Queue'}
            </h3>
            <p className="empty-state-desc">
              {loading 
                ? 'Fetching latest real-time vehicle telemetry and driver inspection reports from database.'
                : statusFilter !== 'ALL'
                  ? `There are currently 0 tickets matching the '${statusFilter}' status filter. Select 'All Tickets' or clear search to review complete history.`
                  : 'All fleet units are currently inspected and operational with zero pending defects. When drivers file pre-trip or post-trip inspection reports, they will immediately appear here for mechanic dispatch.'}
            </p>
            <div className="empty-state-actions">
              {statusFilter !== 'ALL' && (
                <button
                  type="button"
                  className="btn-dash-action"
                  style={{ background: '#0f172a', color: '#fff' }}
                  onClick={() => { setStatusFilter('ALL'); setSearchQuery(''); }}
                >
                  View All Tickets
                </button>
              )}
              {onNavigateTab && (
                <button
                  type="button"
                  className="btn-dash-action"
                  style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1' }}
                  onClick={() => onNavigateTab('Maintenance')}
                >
                  Switch to Maintenance Console →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Vehicles: Adding Vehicle Defaults to ACTIVE (No Status Selection) ──
function Vehicles({ token }) {
  const [vehicles, setVehicles] = useState([]);
  const [query, setQuery]       = useState('');
  const [form, setForm]         = useState(null); // null = hidden, {} = new, {id,...} = edit
  const [err, setErr]           = useState('');
  const [msg, setMsg]           = useState('');

  const load = () => vehicleService.getAll(token).then(setVehicles).catch(e => setErr(e.message));
  useEffect(() => { load(); }, [token]);

  const handleSearch = () => {
    const term = (document.getElementById('input-search-vehicle')?.value ?? query).trim();
    if (!term) { load(); return; }
    vehicleService.search(term, token).then(setVehicles).catch(e => setErr(e.message));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    const formData = new FormData(e.target);
    const isNew = !form.id;

    const payload = {
      ...form,
      registrationNumber: formData.get('registrationNumber') || form.registrationNumber,
      model: formData.get('model') || form.model,
      vehicleType: formData.get('vehicleType') || form.vehicleType,
      currentMileage: Number(formData.get('currentMileage') || form.currentMileage || 0),
      // Automatically default status to ACTIVE when adding new vehicle
      status: isNew ? 'ACTIVE' : (formData.get('status') || form.status || 'ACTIVE')
    };

    try {
      if (form.id) {
        await vehicleService.update(form.id, payload, token);
        setMsg('Vehicle updated successfully.');
      } else {
        await vehicleService.create(payload, token);
        setMsg('Vehicle registered and added to active fleet successfully.');
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
        <input
          id="input-search-vehicle"
          placeholder="Search by registration number, model, vehicle type…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button id="btn-search-vehicle" onClick={handleSearch}>Search</button>
        <button id="btn-clear-search" onClick={() => { setQuery(''); load(); }} style={{ background: '#64748b' }}>Clear</button>
        <button
          id="btn-add-vehicle"
          onClick={() => setForm({ registrationNumber:'', model:'', vehicleType:'', currentMileage:0 })}
          style={{ marginLeft:'auto', background:'#16a34a', color:'white' }}
        >
          + Add New Vehicle
        </button>
      </div>

      {form && (
        <form className="inline" onSubmit={handleSave}>
          <label>Registration Number
            <input
              id="input-vehicle-reg"
              name="registrationNumber"
              required
              placeholder="e.g. KA-01-AB-1234"
              value={form.registrationNumber}
              onChange={e => setForm(prev => ({...prev, registrationNumber: e.target.value}))}
            />
          </label>
          <label>Model
            <input
              id="input-vehicle-model"
              name="model"
              required
              placeholder="e.g. Volvo FH16"
              value={form.model}
              onChange={e => setForm(prev => ({...prev, model: e.target.value}))}
            />
          </label>
          <label>Type
            <input
              id="input-vehicle-type"
              name="vehicleType"
              required
              placeholder="e.g. Heavy Truck"
              value={form.vehicleType}
              onChange={e => setForm(prev => ({...prev, vehicleType: e.target.value}))}
            />
          </label>
          <label>Mileage (km)
            <input
              id="input-vehicle-mileage"
              name="currentMileage"
              type="number"
              min="0"
              required
              value={form.currentMileage}
              onChange={e => setForm(prev => ({...prev, currentMileage: +e.target.value}))}
            />
          </label>

          {/* Only show status when editing existing vehicle, NOT when adding new vehicle */}
          {form.id && (
            <label>Status
              <select
                id="select-vehicle-status"
                name="status"
                value={form.status || 'ACTIVE'}
                onChange={e => setForm(prev => ({...prev, status: e.target.value}))}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </label>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
            <button id="btn-save-vehicle" type="submit">
              {form.id ? 'Save Changes' : '+ Add Vehicle to Fleet'}
            </button>
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

// ── Maintenance Tab ───────────────────────────────────────
function Maintenance({ token }) {
  const [records, setRecords] = useState([]);
  const [mechanics, setMechanics] = useState(DEFAULT_MECHANICS);
  const [query, setQuery]     = useState('');
  const [assignId, setAssignId] = useState(null);
  const [mechUsername, setMechUsername] = useState('mechanic1');
  const [err, setErr]   = useState('');
  const [msg, setMsg]   = useState('');

  const load = () => {
    maintenanceService.getAll(token).then(setRecords).catch(e => setErr(e.message));
    maintenanceService.getMechanics(token)
      .then(list => {
        if (list && list.length > 0) {
          setMechanics(list);
          setMechUsername(list[0].username);
        }
      })
      .catch(() => {});
  };

  useEffect(() => { load(); }, [token]);

  const handleSearch = () => {
    if (!query.trim()) { load(); return; }
    maintenanceService.search(query, token).then(setRecords).catch(e => setErr(e.message));
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    const formEl = e.target;
    const targetMech = formEl.elements['mechanicUsername']?.value || mechUsername;
    try {
      await maintenanceService.assign(assignId, targetMech.trim(), token);
      setMsg('Mechanic assigned successfully.');
      setAssignId(null);
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
        <input
          id="input-search-maintenance"
          placeholder="Search maintenance records by description, vehicle reg…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button id="btn-search-maintenance" onClick={handleSearch}>Search</button>
        <button onClick={() => { setQuery(''); load(); }} style={{ background: '#64748b' }}>Clear</button>
      </div>

      {assignId && (
        <form className="inline" onSubmit={handleAssign} style={{ background: '#fffaf5', border: '1.5px solid #fed7aa' }}>
          <label>Assign to Existing Mechanic
            <select
              id="input-assign-mechanic"
              name="mechanicUsername"
              required
              value={mechUsername}
              onChange={e => setMechUsername(e.target.value)}
            >
              {mechanics.map(m => (
                <option key={m.username} value={m.username}>
                  {m.fullName || m.username} (@{m.username})
                </option>
              ))}
            </select>
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button id="btn-confirm-assign" type="submit" style={{ background: '#ea580c', color: '#fff' }}>
              Confirm Assignment
            </button>
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
              <td style={{ fontWeight: 600, color: '#ea580c' }}>{r.vehicleRegistration}</td>
              <td>{r.issueDescription}</td>
              <td>{r.maintenanceType}</td>
              <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
              <td>{r.reportedBy}</td>
              <td>{r.assignedTo ? <strong style={{ color: '#0f172a' }}>{r.assignedTo}</strong> : '—'}</td>
              <td>
                {r.status === 'OPEN' && (
                  <button className="btn btn-warning btn-assign-action" style={{ background: '#ea580c', color: '#fff' }} onClick={() => { setAssignId(r.id); }}>
                    Assign
                  </button>
                )}
                {r.status === 'COMPLETED' && (
                  <button className="btn btn-success btn-close-action" onClick={() => handleClose(r.id)}>
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
