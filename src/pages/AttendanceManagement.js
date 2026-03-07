import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { attendanceAPI, employeeAPI } from '../services/api';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceList from '../components/AttendanceList';
import '../styles/AttendanceManagement.css';

function AttendanceManagement() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      toast.error('Failed to fetch employees');
    }
  };

  const fetchAttendance = async (employeeId) => {
    if (!employeeId) return;
    
    try {
      setLoading(true);
      const response = await attendanceAPI.getByEmployee(employeeId);
      setAttendance(response.data);
    } catch (err) {
      toast.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (attendanceData) => {
    try {
      await attendanceAPI.mark(attendanceData);
      toast.success('Attendance marked successfully');
      if (attendanceData.employee_id === selectedEmployee) {
        fetchAttendance(selectedEmployee);
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to mark attendance');
    }
  };

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployee(employeeId);
    fetchAttendance(employeeId);
  };

  return (
    <div className="attendance-management">
      <div className="page-header">
        <h2>Attendance Management</h2>
        <p>Mark and view attendance records</p>
      </div>

      <div className="content-grid">
        <div className="form-section">
          <AttendanceForm
            employees={employees}
            onSuccess={handleMarkAttendance}
          />
        </div>

        <div className="records-section">
          <div className="employee-selector">
            <label htmlFor="employee-select">Select Employee:</label>
            <select
              id="employee-select"
              value={selectedEmployee}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="select-input"
            >
              <option value="">-- Select Employee --</option>
              {employees.map(emp => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading attendance records...</p>
            </div>
          ) : selectedEmployee && attendance.length === 0 ? (
            <div className="empty-state">
              <p>No attendance records found for this employee.</p>
            </div>
          ) : selectedEmployee ? (
            <AttendanceList attendance={attendance} />
          ) : (
            <div className="select-prompt">
              <p>Select an employee to view attendance records</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceManagement;