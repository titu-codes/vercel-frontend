import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { employeeAPI } from '../services/api';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeList from '../components/EmployeeList';
import '../styles/EmployeeManagement.css';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employees');
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (employeeData) => {
    try {
      await employeeAPI.create(employeeData);
      toast.success('Employee added successfully');
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add employee');
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(employeeId);
        toast.success('Employee deleted successfully');
        fetchEmployees();
      } catch (err) {
        toast.error(err.response?.data?.detail || 'Failed to delete employee');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="employee-management">
      <div className="page-header">
        <h2>Employee Management</h2>
        <p>Add, view, and manage employee records</p>
      </div>

      <div className="content-grid">
        <div className="form-section">
          <EmployeeForm onSubmit={handleAddEmployee} />
        </div>

        <div className="list-section">
          {error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={fetchEmployees} className="btn-retry">
                Retry
              </button>
            </div>
          ) : employees.length === 0 ? (
            <div className="empty-state">
              <p>No employees found. Add your first employee!</p>
            </div>
          ) : (
            <EmployeeList
              employees={employees}
              onDelete={handleDeleteEmployee}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeManagement;