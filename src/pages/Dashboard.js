import React, { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../services/api';
import { format } from 'date-fns';
import { FaUsers, FaCalendarCheck, FaCalendarTimes } from 'react-icons/fa';
import '../styles/Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    todayPresent: 0,
    todayAbsent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentEmployees, setRecentEmployees] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const [employeesRes, attendanceRes] = await Promise.all([
        employeeAPI.getAll(),
        attendanceAPI.getByDate(today),
      ]);

      const employees = employeesRes.data;
      const todayAttendance = attendanceRes.data;

      const presentCount = todayAttendance.filter(
        record => record.status === 'Present'
      ).length;

      setStats({
        totalEmployees: employees.length,
        todayPresent: presentCount,
        todayAbsent: employees.length - presentCount,
      });

      setRecentEmployees(employees.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of HRMS Lite</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total-employees">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>Total Employees</h3>
            <p className="stat-value">{stats.totalEmployees}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon present">
            <FaCalendarCheck />
          </div>
          <div className="stat-info">
            <h3>Present Today</h3>
            <p className="stat-value">{stats.todayPresent}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon absent">
            <FaCalendarTimes />
          </div>
          <div className="stat-info">
            <h3>Absent Today</h3>
            <p className="stat-value">{stats.todayAbsent}</p>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <h3>Recent Employees</h3>
        {recentEmployees.length === 0 ? (
          <div className="empty-state">
            <p>No employees found</p>
          </div>
        ) : (
          <div className="recent-table">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map(emp => (
                  <tr key={emp.employee_id}>
                    <td>{emp.employee_id}</td>
                    <td>{emp.full_name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
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