import React from 'react';
// CHANGE THIS LINE:
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

import EmployeeManagement from './pages/EmployeeManagement';
import AttendanceManagement from './pages/AttendanceManagement';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <h1 className="logo">HRMS Lite</h1>
            <div className="nav-links">
              {/* Links will automatically work with HashRouter */}
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/employees" className="nav-link">Employees</Link>
              <Link to="/attendance" className="nav-link">Attendance</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeeManagement />} />
              <Route path="/attendance" element={<AttendanceManagement />} />
            </Routes>
          </div>
        </main>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;