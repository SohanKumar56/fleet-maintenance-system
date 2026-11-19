import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import heroTruckImage from '../assets/optiwheels_hero.jpg';

const FLEET_REGISTRY = {
  'KA-01-AB-1234': {
    plate: 'KA-01-AB-1234',
    model: 'Volvo FH16',
    type: 'Heavy Truck',
    status: 'ACTIVE',
    odometer: '45,000 km',
    assignedDriver: 'Alice Driver (driver1)',
    assignedMechanic: 'Bob Mechanic (mechanic1)',
    serviceStatus: 'Inspected & Road Ready'
  },
  'MH-02-CD-5678': {
    plate: 'MH-02-CD-5678',
    model: 'Tata Prima',
    type: 'Container Truck',
    status: 'ACTIVE',
    odometer: '32,000 km',
    assignedDriver: 'Alice Driver (driver1)',
    assignedMechanic: 'Bob Mechanic (mechanic1)',
    serviceStatus: 'Operational & Verified'
  }
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeRoleTab, setActiveRoleTab] = useState('manager');
  const [showVehicleLookupModal, setShowVehicleLookupModal] = useState(false);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupNotFound, setLookupNotFound] = useState(false);

  const handlePortalLogin = (mode = 'signin', role = '') => {
    let url = `/login?mode=${mode}`;
    if (role) {
      url += `&role=${role}`;
    }
    navigate(url);
  };

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    setLookupNotFound(false);
    const cleanQuery = lookupQuery.trim().toUpperCase();
    if (!cleanQuery) return;

    if (FLEET_REGISTRY[cleanQuery]) {
      setLookupResult(FLEET_REGISTRY[cleanQuery]);
    } else {
      // Fuzzy lookup by partial plate or model
      const found = Object.values(FLEET_REGISTRY).find(
        v => v.plate.includes(cleanQuery) || v.model.toUpperCase().includes(cleanQuery)
      );
      if (found) {
        setLookupResult(found);
      } else {
        setLookupResult(null);
        setLookupNotFound(true);
      }
    }
  };

  const openLookupWithPlate = (plate) => {
    setLookupQuery(plate);
    setLookupResult(FLEET_REGISTRY[plate] || null);
    setLookupNotFound(false);
    setShowVehicleLookupModal(true);
  };

  return (
    <div className="optiwheels-page">
      {/* Subtle Background Watermarks */}
      <div className="bg-tech-circuit left-circuit" aria-hidden="true"></div>
      <div className="bg-tech-circuit right-circuit" aria-hidden="true"></div>

      {/* Header / Navbar */}
      <header className="opti-navbar">
        <div className="opti-nav-container">
          {/* Brand Logo */}
          <div className="opti-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="opti-brand-text">
              <span className="brand-primary-name">OPTIWHEELS</span>
              <span className="brand-secondary-name">LOGISTICS</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="opti-nav-links">
            <a href="#home" className="nav-link active">Home</a>
            <a href="#fleet" className="nav-link">Fleet Roster</a>
            <a href="#workflows" className="nav-link">Maintenance Workflow</a>
            <a href="#roles" className="nav-link">Role Portals</a>
            <a href="#about" className="nav-link">About System</a>
          </nav>

          {/* Navigation Actions */}
          <div className="opti-nav-actions">
            <button 
              type="button"
              className="btn-lookup-nav" 
              onClick={() => setShowVehicleLookupModal(true)}
            >
              Vehicle Status
            </button>
            <button 
              type="button"
              className="btn-portal-signin" 
              onClick={() => handlePortalLogin('signin')}
            >
              Staff Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="opti-hero-section">
        <div className="opti-hero-container">
          {/* Left Column: Clear Internal Scope Copy */}
          <div className="opti-hero-content">
            <div className="opti-hero-eyebrow">
              OPTIWHEELS LOGISTICS • INTERNAL FLEET OPERATIONS
            </div>

            <h1 className="opti-hero-title">
              FLEET MAINTENANCE,<br />
              OPTIMIZED FOR THE ROAD
            </h1>

            <p className="opti-hero-subtitle">
              A centralized operating system built specifically for Optiwheels Logistics 
              to log vehicle defects, dispatch repair work orders to certified internal mechanics, 
              and keep our organization-owned fleet 100% roadworthy.
            </p>

            <div className="opti-hero-cta-group">
              <button 
                type="button"
                className="btn-hero-dark" 
                onClick={() => handlePortalLogin('signin')}
              >
                Access Staff Portal
              </button>

              <button 
                type="button"
                className="btn-hero-orange" 
                onClick={() => setShowVehicleLookupModal(true)}
              >
                Inspect Vehicle Status
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Image (Clean, No Floating Popups) */}
          <div className="opti-hero-visual">
            <div className="hero-image-wrapper">
              <img 
                src={heroTruckImage} 
                alt="Optiwheels Logistics Internal Commercial Fleet" 
                className="hero-main-img" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Maintenance Pillars (Why Choose Us / System Capabilities) */}
      <section id="workflows" className="why-choose-section">
        <div className="section-container">
          <h2 className="why-choose-heading">Centralized Fleet Maintenance Workflow</h2>

          <div className="features-grid">
            {/* Pillar 1: Timely Problem Reporting */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3 className="feature-title">Timely Problem Reporting</h3>
              <p className="feature-desc">
                Drivers instantly record vehicle defects, mileage, and warning lights before or after trips, eliminating lost paper forms.
              </p>
            </div>

            {/* Pillar 2: Clear Work Ownership */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </div>
              <h3 className="feature-title">Clear Work Ownership</h3>
              <p className="feature-desc">
                Fleet managers assign every reported fault to a specific internal mechanic, ensuring unambiguous responsibility and priority.
              </p>
            </div>

            {/* Pillar 3: Zero-Downtime Repair Workflow */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h3 className="feature-title">Repair Progress Tracking</h3>
              <p className="feature-desc">
                Technicians track jobs in real time through ASSIGNED, IN PROGRESS, and COMPLETED stages with recorded audit history.
              </p>
            </div>

            {/* Pillar 4: Reliable Maintenance Records */}
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3 className="feature-title">Reliable Maintenance Records</h3>
              <p className="feature-desc">
                Complete chronological service history retained securely in our relational database, helping prevent recurring vehicle defects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Roster Section (Organization-Owned Vehicles) */}
      <section id="fleet" className="fleet-showcase-section">
        <div className="section-container">
          <div className="section-heading-block">
            <span className="section-category">ORGANIZATION-OWNED FLEET ROSTER</span>
            <h2 className="section-main-title">Optiwheels Fleet Readiness</h2>
            <p className="section-sub-title">
              Live status and telemetry for company-owned commercial transport units. Click any vehicle to inspect details.
            </p>
          </div>

          <div className="fleet-cards-grid">
            {Object.values(FLEET_REGISTRY).map((veh) => (
              <div 
                key={veh.plate} 
                className="fleet-card" 
                onClick={() => openLookupWithPlate(veh.plate)} 
                style={{ cursor: 'pointer' }}
              >
                <div className={`fleet-card-badge ${veh.status === 'ACTIVE' ? 'active' : 'maintenance'}`}>
                  STATUS: {veh.status}
                </div>
                <div className="fleet-card-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <h3 className="fleet-card-name">{veh.model}</h3>
                <div className="fleet-card-reg">PLATE: {veh.plate}</div>
                <div className="fleet-card-metrics">
                  <div className="metric-box">
                    <span className="metric-title">Vehicle Class</span>
                    <span className="metric-value">{veh.type}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-title">Odometer</span>
                    <span className="metric-value">{veh.odometer}</span>
                  </div>
                </div>
                <div style={{ marginTop: '1.2rem', paddingTop: '0.9rem', borderTop: '1px solid #f1f5f9', fontSize: '0.82rem', color: 'var(--opti-text-muted)' }}>
                  <div><strong>Assigned Driver:</strong> {veh.assignedDriver}</div>
                  <div><strong>Lead Mechanic:</strong> {veh.assignedMechanic}</div>
                  <div style={{ marginTop: '0.2rem' }}><strong>Readiness:</strong> <span style={{ color: '#059669', fontWeight: 600 }}>{veh.serviceStatus}</span></div>
                </div>
                <div className="fleet-card-footer-tip" style={{ marginTop: '0.9rem' }}>Click to inspect service record →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Portals Section */}
      <section id="roles" className="solutions-section">
        <div className="section-container">
          <div className="section-heading-block">
            <span className="section-category">ROLE-BASED WORKSTATIONS</span>
            <h2 className="section-main-title">Designed for Internal Operational Roles</h2>
            <p className="section-sub-title">
              Sign in with your role-based staff credentials to access your dedicated maintenance dashboard.
            </p>
          </div>

          <div className="solutions-tabs-bar">
            <button 
              type="button"
              className={`tab-btn ${activeRoleTab === 'manager' ? 'active' : ''}`}
              onClick={() => setActiveRoleTab('manager')}
            >
              <span>👔</span> Fleet Manager
            </button>
            <button 
              type="button"
              className={`tab-btn ${activeRoleTab === 'driver' ? 'active' : ''}`}
              onClick={() => setActiveRoleTab('driver')}
            >
              <span>🚚</span> Commercial Driver
            </button>
            <button 
              type="button"
              className={`tab-btn ${activeRoleTab === 'mechanic' ? 'active' : ''}`}
              onClick={() => setActiveRoleTab('mechanic')}
            >
              <span>🔧</span> Service Mechanic
            </button>
          </div>

          <div className="solution-panel-card">
            {activeRoleTab === 'manager' && (
              <div className="solution-split">
                <div className="solution-text">
                  <div className="solution-tag">MANAGEMENT COMMAND</div>
                  <h3>Fleet Control & Technician Work Assignment</h3>
                  <p>
                    Full visibility over vehicle availability, open problem reports, and mechanic work orders.
                    Review driver submissions, assign internal mechanics, monitor repair turnaround, and track costs.
                  </p>
                  <ul className="solution-checklist">
                    <li>Add, inspect, and manage organization-owned fleet vehicles</li>
                    <li>Review incoming defect reports submitted by drivers</li>
                    <li>Assign work orders to internal mechanics with clear priority</li>
                    <li>Real-time dashboard metrics (Active vs In-Maintenance counts)</li>
                  </ul>
                  <button 
                    type="button"
                    className="btn-launch-portal" 
                    onClick={() => handlePortalLogin('signin', 'MANAGER')}
                  >
                    Launch Manager Portal →
                  </button>
                </div>
                <div className="solution-stats-preview">
                  <div className="stat-box">
                    <span className="stat-label">Registered Fleet</span>
                    <span className="stat-num">2 Vehicles</span>
                  </div>
                  <div className="stat-box highlight-orange">
                    <span className="stat-label">Fleet Status</span>
                    <span className="stat-num">100% Active</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Role Domains</span>
                    <span className="stat-num">3 Portals</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">System Storage</span>
                    <span className="stat-num">H2 Database</span>
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'driver' && (
              <div className="solution-split">
                <div className="solution-text">
                  <div className="solution-tag">DRIVER PRE-TRIP & DEFECT REPORTING</div>
                  <h3>Driver Issue & Inspection Reporting</h3>
                  <p>
                    Drivers can easily report problems with their assigned fleet vehicle. Log warning lights,
                    braking concerns, tire wear, and current odometer reading to trigger immediate maintenance.
                  </p>
                  <ul className="solution-checklist">
                    <li>Submit issue descriptions with priority and current mileage</li>
                    <li>Track status of reported problems (PENDING, IN_PROGRESS, COMPLETED)</li>
                    <li>View repair history for assigned vehicles</li>
                    <li>Ensure vehicle road readiness before departure</li>
                  </ul>
                  <button 
                    type="button"
                    className="btn-launch-portal" 
                    onClick={() => handlePortalLogin('signin', 'DRIVER')}
                  >
                    Launch Driver Portal →
                  </button>
                </div>
                <div className="solution-stats-preview">
                  <div className="driver-preview-ticket">
                    <div className="ticket-header">
                      <span>Defect Report #1</span>
                      <span className="ticket-status-pill">STATUS: OPEN</span>
                    </div>
                    <div className="ticket-vehicle">KA-01-AB-1234 (Volvo FH16)</div>
                    <div className="ticket-issue">Issue: Pre-trip vehicle inspection report</div>
                    <div className="ticket-route">Mileage: 45,000 km • Driver: Alice Driver (driver1)</div>
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'mechanic' && (
              <div className="solution-split">
                <div className="solution-text">
                  <div className="solution-tag">WORKSHOP & REPAIR EXECUTION</div>
                  <h3>Internal Mechanic Service Terminal</h3>
                  <p>
                    Internal technicians receive assigned repair jobs, view reported problem details, 
                    and transition work orders through SCHEDULED, IN PROGRESS, and COMPLETED stages.
                  </p>
                  <ul className="solution-checklist">
                    <li>View list of assigned maintenance tickets</li>
                    <li>One-click status transitions (Start Repair ➔ Mark Complete)</li>
                    <li>Automatically sets vehicle status back to ACTIVE on completion</li>
                    <li>Maintains audit trail with timestamps and technician attribution</li>
                  </ul>
                  <button 
                    type="button"
                    className="btn-launch-portal" 
                    onClick={() => handlePortalLogin('signin', 'MECHANIC')}
                  >
                    Launch Mechanic Portal →
                  </button>
                </div>
                <div className="solution-stats-preview">
                  <div className="mechanic-preview-card">
                    <div className="workorder-header">
                      <span>Work Order #1</span>
                      <span className="workorder-badge">IN_PROGRESS</span>
                    </div>
                    <div className="workorder-title">Assigned to mechanic1 (Bob Mechanic)</div>
                    <div className="workorder-steps">
                      <div className="step done">✓ Assigned</div>
                      <div className="step active">● In Progress</div>
                      <div className="step">○ Mark Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section: Explaining the Scope Clearly */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="about-card">
            <div className="about-content">
              <span className="about-badge">SYSTEM ARCHITECTURE & PURPOSE</span>
              <h2>Built Exclusively for Optiwheels Logistics Fleet Operations</h2>
              <p>
                This web application serves as the internal maintenance command hub for Optiwheels Logistics.
                It centralizes vehicle records, eliminates forgotten defect reports, enforces mechanic accountability,
                and maintains full service logs across the organization-owned fleet.
              </p>
              <div className="about-highlights">
                <div className="about-highlight-item">
                  <span className="highlight-icon">✓</span>
                  <span>Internal Organization Scope — No External Customers or Billing</span>
                </div>
                <div className="about-highlight-item">
                  <span className="highlight-icon">✓</span>
                  <span>Role-Based Security with Spring Security & BCrypt Hashing</span>
                </div>
                <div className="about-highlight-item">
                  <span className="highlight-icon">✓</span>
                  <span>Embedded H2 Database Persistence with Zero Config Required</span>
                </div>
              </div>
            </div>
            <div className="about-action">
              <button 
                type="button"
                className="btn-hero-dark"
                onClick={() => handlePortalLogin('signin')}
              >
                Sign In to Staff Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Modal: Vehicle Inspection & Status Lookup (Internal Use) */}
      {showVehicleLookupModal && (
        <div className="opti-modal-backdrop" onClick={() => setShowVehicleLookupModal(false)}>
          <div className="opti-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Internal Vehicle Status Check</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowVehicleLookupModal(false)}>✕</button>
            </div>
            <form onSubmit={handleLookupSubmit} className="track-form">
              <label htmlFor="vehicleLookupInput">Enter License Plate or Model Name</label>
              <div className="track-input-group">
                <input 
                  id="vehicleLookupInput"
                  type="text" 
                  placeholder="e.g. KA-01-AB-1234 or Volvo" 
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn-track-submit">Search</button>
              </div>
            </form>

            {lookupNotFound && (
              <div className="lookup-not-found">
                No matching vehicle found in registry. Try <strong>KA-01-AB-1234</strong> or <strong>MH-02-CD-5678</strong>.
              </div>
            )}

            {lookupResult && (
              <div className="track-result-card">
                <div className="result-top">
                  <div>
                    <span className="result-id">{lookupResult.plate}</span>
                    <span className="result-carrier">{lookupResult.model}</span>
                  </div>
                  <span className={`result-badge-transit ${lookupResult.status === 'ACTIVE' ? 'badge-active' : 'badge-maintenance'}`}>
                    {lookupResult.status}
                  </span>
                </div>
                <div className="result-detail-line">
                  <strong>Vehicle Type:</strong> {lookupResult.type}
                </div>
                <div className="result-detail-line">
                  <strong>Current Odometer:</strong> {lookupResult.odometer}
                </div>
                <div className="result-detail-line">
                  <strong>Assigned Driver:</strong> {lookupResult.assignedDriver}
                </div>
                <div className="result-detail-line">
                  <strong>Primary Technician:</strong> {lookupResult.assignedMechanic}
                </div>
                <div className="result-detail-line">
                  <strong>Readiness Status:</strong> {lookupResult.serviceStatus}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Elegant Footer */}
      <footer className="opti-footer">
        <div className="section-container">
          <div className="footer-grid">
            <div className="footer-col-brand">
              <div className="brand-primary-name">OPTIWHEELS</div>
              <div className="brand-secondary-name">LOGISTICS</div>
              <p className="footer-brand-desc">
                Centralized Fleet Maintenance Management System for organization-owned commercial vehicles.
              </p>
            </div>

            <div className="footer-col">
              <h4>System Links</h4>
              <a href="#home">Home</a>
              <a href="#fleet">Fleet Roster</a>
              <a href="#workflows">Maintenance Workflow</a>
              <a href="#roles">Role Portals</a>
              <a href="#about">About System</a>
            </div>

            <div className="footer-col">
              <h4>Internal Portals</h4>
              <button type="button" className="footer-link-btn" onClick={() => handlePortalLogin('signin', 'MANAGER')}>
                Fleet Manager Portal
              </button>
              <button type="button" className="footer-link-btn" onClick={() => handlePortalLogin('signin', 'DRIVER')}>
                Commercial Driver Portal
              </button>
              <button type="button" className="footer-link-btn" onClick={() => handlePortalLogin('signin', 'MECHANIC')}>
                Service Mechanic Portal
              </button>
            </div>

            <div className="footer-col">
              <h4>System Architecture</h4>
              <span>Spring Boot 3.2.1 Core</span>
              <span>Embedded H2 Database Engine</span>
              <span>BCrypt Password Encryption</span>
              <span>Stateless JWT Authentication</span>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <div>© {new Date().getFullYear()} Optiwheels Logistics. Internal Fleet Operations.</div>
            <div className="system-pill">
              <span className="dot-green"></span> H2 Database Connected
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
