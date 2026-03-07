import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaIdBadge, FaBuilding } from 'react-icons/fa';
import '../styles/EmployeeForm.css';

function EmployeeForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'IT Support',
    'Research & Development',
    'Customer Support',
    'Product Management'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employee_id.trim()) {
      newErrors.employee_id = 'Employee ID is required';
    } else if (!/^[A-Za-z0-9_-]+$/.test(formData.employee_id)) {
      newErrors.employee_id = 'Only letters, numbers, underscores, and hyphens allowed';
    }
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      
      // Reset form after successful submission
      if (!initialData) {
        setFormData({
          employee_id: '',
          full_name: '',
          email: '',
          department: '',
        });
      }
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="employee-form-container">
      <div className="form-header">
        <h3>Add New Employee</h3>
        <p>Fill in the details to add a new employee record</p>
      </div>
      
      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-group">
          <label htmlFor="employee_id" className="form-label">
            <FaIdBadge className="input-icon" />
            Employee ID *
          </label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            className={`form-input ${errors.employee_id ? 'input-error' : ''}`}
            placeholder="e.g., EMP001"
            disabled={isSubmitting}
          />
          {errors.employee_id && (
            <span className="form-error">{errors.employee_id}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="full_name" className="form-label">
            <FaUser className="input-icon" />
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={`form-input ${errors.full_name ? 'input-error' : ''}`}
            placeholder="e.g., John Doe"
            disabled={isSubmitting}
          />
          {errors.full_name && (
            <span className="form-error">{errors.full_name}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            <FaEnvelope className="input-icon" />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            placeholder="e.g., john.doe@company.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <span className="form-error">{errors.email}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="department" className="form-label">
            <FaBuilding className="input-icon" />
            Department *
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`select-input ${errors.department ? 'input-error' : ''}`}
            disabled={isSubmitting}
          >
            <option value="">Select a department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <span className="form-error">{errors.department}</span>
          )}
        </div>
        
        <div className="form-actions">
          {initialData ? (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => window.history.back()}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Employee'}
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span>
                  Adding Employee...
                </>
              ) : (
                'Add Employee'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;