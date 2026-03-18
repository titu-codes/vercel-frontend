import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaUserPlus, FaCalendarAlt } from 'react-icons/fa';
import '../styles/Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <div>
          <h1 className="dashboard-hero__title">Welcome back</h1>
          <p className="dashboard-hero__subtitle">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="dashboard-hero__actions">
          <Link to="/employees" className="btn btn-primary">
            <FaUserPlus />
            Add Employee
          </Link>
          <Link to="/attendance" className="btn btn-secondary">
            <FaCalendarAlt />
            Mark Attendance
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
