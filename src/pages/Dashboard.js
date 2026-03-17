import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaUsers, FaCalendarCheck, FaCalendarTimes, FaUserPlus, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import { analyticsAPI, employeeAPI } from '../services/api';
import StatCard from '../components/shared/StatCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import '../styles/Dashboard.css';

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const today = format(new Date(), 'yyyy-MM-dd');
      const [analyticsRes, employeesRes] = await Promise.all([
        analyticsAPI.getDashboard(7, today),
        employeeAPI.getAll(),
      ]);
      setAnalytics(analyticsRes.data);
      setRecentEmployees(employeesRes.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard. Please ensure the backend is running.');
      setAnalytics({
        total_employees: 0,
        today_present: 0,
        today_absent: 0,
        last7_days: { present_count: 0, absent_count: 0 },
        most_absent_last7_days: [],
        attendance_by_date: [],
      });
      try {
        const employeesRes = await employeeAPI.getAll();
        setRecentEmployees(employeesRes.data.slice(0, 5));
      } catch (e) {
        setRecentEmployees([]);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  const attendanceRate =
    analytics.total_employees > 0
      ? Math.round((analytics.today_present / analytics.total_employees) * 100)
      : 0;

  return (
    <div className="dashboard" data-testid="dashboard">
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

      {error && (
        <div className="dashboard-error">
          <FaExclamationTriangle />
          <span>{error}</span>
          <button className="btn btn-primary btn-sm" onClick={fetchDashboardData}>
            Retry
          </button>
        </div>
      )}

      <div className="dashboard-stats">
        <StatCard
          icon={FaUsers}
          label="Total Employees"
          value={analytics.total_employees}
          variant="default"
        />
        <StatCard
          icon={FaCalendarCheck}
          label="Present Today"
          value={analytics.today_present}
          variant="success"
        />
        <StatCard
          icon={FaCalendarTimes}
          label="Absent Today"
          value={analytics.today_absent}
          variant="danger"
        />
        <StatCard
          icon={FaCalendarCheck}
          label="Attendance Rate (Today)"
          value={`${attendanceRate}%`}
          variant="default"
        />
      </div>

      <div className="dashboard-card dashboard-card--recent">
        <h3 className="dashboard-card__title">Recent Employees</h3>
        {recentEmployees.length === 0 ? (
          <div className="dashboard-empty-inline">
            <p>No employees yet. Add your first employee to get started.</p>
            <Link to="/employees" className="btn btn-primary">
              Add Employee
            </Link>
          </div>
        ) : (
          <div className="recent-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map((emp) => (
                  <tr key={emp.employee_id}>
                    <td>
                      <span className="id-badge">{emp.employee_id}</span>
                    </td>
                    <td>
                      <div className="employee-cell">
                        <div className="avatar-placeholder">
                          {emp.full_name.charAt(0).toUpperCase()}
                        </div>
                        <span>{emp.full_name}</span>
                      </div>
                    </td>
                    <td>{emp.email}</td>
                    <td>
                      <span className="dept-badge">{emp.department}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
