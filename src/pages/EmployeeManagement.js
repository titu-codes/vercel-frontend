import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { employeeAPI } from '../services/api';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeList from '../components/EmployeeList';
import Modal from '../components/shared/Modal';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';
import { FaUserTie } from 'react-icons/fa';
import '../styles/EmployeeManagement.css';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, employee: null });

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

  const handleDeleteClick = (employee) => {
    setDeleteModal({ isOpen: true, employee });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.employee) return;
    try {
      await employeeAPI.delete(deleteModal.employee.employee_id);
      toast.success('Employee deleted successfully');
      setDeleteModal({ isOpen: false, employee: null });
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete employee');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner message="Loading employees..." />
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
              <button onClick={fetchEmployees} className="btn btn-primary">
                Retry
              </button>
            </div>
          ) : employees.length === 0 ? (
            <EmptyState
              icon={FaUserTie}
              title="No employees yet"
              message="Add your first employee to get started."
            />
          ) : (
            <EmployeeList employees={employees} onDelete={handleDeleteClick} />
          )}
        </div>
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, employee: null })}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteModal.employee?.full_name} (${deleteModal.employee?.employee_id})? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}

export default EmployeeManagement;
