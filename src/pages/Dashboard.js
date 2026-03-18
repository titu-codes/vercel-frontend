import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FaUsers,
  FaCalendarCheck,
  FaCalendarTimes,
  FaUserPlus,
  FaCalendarAlt,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { analyticsAPI, employeeAPI } from '../services/api';
import StatCard from '../components/shared/StatCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import '../styles/Dashboard.css';

const COLORS = {
  present: '#10b981',
  absent: '#ef4444',
};

function Dashboard() {
  const location = useLocation();
  const [analytics, setAnalytics] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const today = format(new Date(), 'yyyy-MM-dd');
      const [analyticsRes, employeesRes] = await Promise.all([
        analyticsAPI.getDashboard(7, today),
        employeeAPI.getAll(),
      ]);
      setAnalytics(analyticsRes.data);
      setEmployees(employeesRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard. Please ensure the backend is running.');
      setAnalytics({
        total_employees: 0,
        today_present: 0,
        today_absent: 0,
        last7_days: { present_count: 0, absent_count: 0 },
        attendance_by_date: [],
      });
      try {
        const employeesRes = await employeeAPI.getAll();
        setEmployees(employeesRes.data);
      } catch (e) {
        setEmployees([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Refetch when navigating to Dashboard or when tab becomes visible (after marking attendance)
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '') {
      fetchDashboardData();
    }
  }, [location.pathname, fetchDashboardData]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchDashboardData();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [fetchDashboardData]);

  // Refetch when attendance is marked (from AttendanceForm or AttendanceList flow)
  useEffect(() => {
    const onAttendanceUpdated = () => fetchDashboardData();
    window.addEventListener('attendance-updated', onAttendanceUpdated);
    return () => window.removeEventListener('attendance-updated', onAttendanceUpdated);
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  const todayPieData = [
    { name: 'Present', value: analytics.today_present, color: COLORS.present },
    { name: 'Absent', value: analytics.today_absent, color: COLORS.absent },
  ].filter((d) => d.value > 0);

  const weekPieData = [
    {
      name: 'Present',
      value: analytics.last7_days?.present_count || 0,
      color: COLORS.present,
    },
    {
      name: 'Absent',
      value: analytics.last7_days?.absent_count || 0,
      color: COLORS.absent,
    },
  ].filter((d) => d.value > 0);

  const barChartData =
    analytics.attendance_by_date?.map((item) => ({
      date: format(new Date(item.date), 'MMM dd'),
      Present: item.present_count,
      Absent: item.absent_count,
    })) || [];

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
          label="Present Employees"
          value={analytics.today_present}
          variant="success"
        />
        <StatCard
          icon={FaCalendarTimes}
          label="Absent Employees"
          value={analytics.today_absent}
          variant="danger"
        />
      </div>

      <div className="dashboard-charts-row">
        <div className="dashboard-card dashboard-card--pie">
          <h3 className="dashboard-card__title">Today&apos;s Attendance</h3>
          {todayPieData.length > 0 ? (
            <div className="dashboard-pie-chart">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={todayPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {todayPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="dashboard-chart-empty">
              <p>No attendance marked today</p>
              <p className="dashboard-chart-empty__hint">
                Mark attendance in the Attendance tab to see data
              </p>
            </div>
          )}
        </div>

        <div className="dashboard-card dashboard-card--pie">
          <h3 className="dashboard-card__title">This Week&apos;s Attendance</h3>
          {weekPieData.length > 0 ? (
            <div className="dashboard-pie-chart">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={weekPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {weekPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="dashboard-chart-empty">
              <p>No attendance data for this week</p>
              <p className="dashboard-chart-empty__hint">
                Mark attendance in the Attendance tab to see data
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-card dashboard-card--bar">
        <h3 className="dashboard-card__title">Attendance Trend (Last 7 Days)</h3>
        {barChartData.length > 0 ? (
          <div className="dashboard-bar-chart">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                  }}
                />
                <Legend />
                <Bar dataKey="Present" fill={COLORS.present} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Absent" fill={COLORS.absent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="dashboard-chart-empty">
            <p>No attendance data for the last 7 days</p>
            <p className="dashboard-chart-empty__hint">
              Mark attendance in the Attendance tab to see trends
            </p>
          </div>
        )}
      </div>

      <div className="dashboard-card dashboard-card--recent">
        <h3 className="dashboard-card__title">All Employees</h3>
        {employees.length === 0 ? (
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
                {employees.map((emp) => (
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
