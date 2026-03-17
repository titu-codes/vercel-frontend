import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartLine, FaUsers, FaCalendarCheck, FaBars, FaTimes } from 'react-icons/fa';
import '../../styles/Sidebar.css';

const navItems = [
  { to: '/', icon: FaChartLine, label: 'Dashboard' },
  { to: '/employees', icon: FaUsers, label: 'Employees' },
  { to: '/attendance', icon: FaCalendarCheck, label: 'Attendance' },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">HR</span>
            <span className="logo-text">HRMS Lite</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="sidebar-link-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <span className="user-role">Admin</span>
              <span className="user-label">HR Manager</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
