import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { attendanceAPI, employeeAPI } from '../services/api';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceList from '../components/AttendanceList';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import { FaCalendar } from 'react-icons/fa';
import '../styles/AttendanceManagement.css';

function AttendanceManagement() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
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
      if (attendanceData.employee_id === selectedEmployee?.employee_id) {
        fetchAttendance(selectedEmployee.employee_id);
      }
      // Notify Dashboard to refetch analytics
      window.dispatchEvent(new CustomEvent('attendance-updated'));
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to mark attendance');
    }
  };

  const handleEmployeeSelect = (e) => {
    const employeeId = e.target.value;
    if (!employeeId) {
      setSelectedEmployee(null);
      setAttendance([]);
      return;
    }
    const emp = employees.find((e) => e.employee_id === employeeId);
    setSelectedEmployee(emp || null);
    fetchAttendance(employeeId);
  };

  return (
    <div className="attendance-management">
      <div className="page-header">
        <h2>Attendance Management</h2>
        <p>Mark and view attendance records by employee</p>
      </div>

      <div className="content-grid">
        <div className="form-section">
          <AttendanceForm employees={employees} onSuccess={handleMarkAttendance} />
        </div>

        <div className="records-section">
          <div className="employee-selector-card">
            <label htmlFor="employee-select" className="employee-selector-label">
              Select Employee to View Records
            </label>
            <select
              id="employee-select"
              value={selectedEmployee?.employee_id || ''}
              onChange={handleEmployeeSelect}
              className="select-input employee-select"
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="records-loading">
              <LoadingSpinner message="Loading attendance records..." />
            </div>
          ) : selectedEmployee && attendance.length === 0 ? (
            <EmptyState
              icon={FaCalendar}
              title="No attendance records"
              message={`No attendance has been marked yet for ${selectedEmployee.full_name}.`}
            />
          ) : selectedEmployee ? (
            <AttendanceList attendance={attendance} employee={selectedEmployee} />
          ) : (
            <div className="select-prompt">
              <FaCalendar className="select-prompt-icon" />
              <p>Select an employee to view their attendance records</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceManagement;
