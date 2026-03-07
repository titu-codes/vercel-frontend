import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  FaCalendarAlt, 
  FaUser, 
  FaCheckCircle, 
  FaTimesCircle,
  FaSave 
} from 'react-icons/fa';
import { attendanceAPI } from '../services/api';
import '../styles/AttendanceForm.css';

function AttendanceForm({ employees, onSuccess }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'Present'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState([]);

  // Fetch today's attendance when employees or date changes
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      if (formData.date) {
        try {
          const response = await attendanceAPI.getByDate(formData.date);
          setTodayAttendance(response.data);
        } catch (error) {
          console.error('Failed to fetch today\'s attendance:', error);
        }
      }
    };

    fetchTodayAttendance();
  }, [formData.date]);

  // Get employees who haven't been marked for attendance today
  const getAvailableEmployees = () => {
    const markedEmployeeIds = todayAttendance.map(record => record.employee_id);
    return employees.filter(employee => 
      !markedEmployeeIds.includes(employee.employee_id)
    );
  };

  const availableEmployees = getAvailableEmployees();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employee_id) {
      newErrors.employee_id = 'Please select an employee';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.status) {
      newErrors.status = 'Please select attendance status';
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

    // Check if attendance already marked for this employee on this date
    const alreadyMarked = todayAttendance.find(
      record => record.employee_id === formData.employee_id
    );
    
    if (alreadyMarked) {
      toast.error('Attendance already marked for this employee today');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSuccess(formData);
      
      // Reset form after successful submission
      setFormData({
        employee_id: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        status: 'Present'
      });
      setErrors({});
      toast.success('Attendance marked successfully!');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.response?.data?.detail || 'Failed to mark attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickMark = (status) => {
    if (!formData.employee_id) {
      toast.error('Please select an employee first');
      return;
    }

    const quickFormData = {
      ...formData,
      status
    };

    // Submit immediately
    handleSubmit({ 
      preventDefault: () => {} 
    }, quickFormData);
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? `${employee.full_name} (${employee.employee_id})` : '';
  };

  return (
    <div className="attendance-form-container">
      <div className="form-header">
        <h3>
          <FaCalendarAlt className="header-icon" />
          Mark Attendance
        </h3>
        <p>Mark attendance for employees on a specific date</p>
      </div>
      
      <div className="attendance-stats">
        <div className="stat-item">
          <span className="stat-label">Total Employees:</span>
          <span className="stat-value">{employees.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Marked Today:</span>
          <span className="stat-value">{todayAttendance.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Remaining:</span>
          <span className="stat-value">{availableEmployees.length}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="attendance-form">
        <div className="form-group">
          <label htmlFor="employee_id" className="form-label">
            <FaUser className="input-icon" />
            Select Employee *
          </label>
          <select
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            className={`select-input ${errors.employee_id ? 'input-error' : ''}`}
            disabled={isSubmitting || availableEmployees.length === 0}
          >
            <option value="">-- Select Employee --</option>
            {availableEmployees.map(employee => (
              <option key={employee.employee_id} value={employee.employee_id}>
                {employee.full_name} ({employee.employee_id}) - {employee.department}
              </option>
            ))}
          </select>
          {errors.employee_id && (
            <span className="form-error">{errors.employee_id}</span>
          )}
          {availableEmployees.length === 0 && (
            <div className="form-warning">
              All employees have been marked for attendance today.
            </div>
          )}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date" className="form-label">
              <FaCalendarAlt className="input-icon" />
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`form-input ${errors.date ? 'input-error' : ''}`}
              disabled={isSubmitting}
              max={format(new Date(), 'yyyy-MM-dd')}
            />
            {errors.date && (
              <span className="form-error">{errors.date}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`select-input ${errors.status ? 'input-error' : ''}`}
              disabled={isSubmitting}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            {errors.status && (
              <span className="form-error">{errors.status}</span>
            )}
          </div>
        </div>

        {formData.employee_id && (
          <div className="selected-employee-info">
            <div className="info-header">
              <FaUser className="info-icon" />
              <span>Selected Employee</span>
            </div>
            <div className="employee-details">
              <p className="employee-name">{getEmployeeName(formData.employee_id)}</p>
              <div className="quick-actions">
                <button
                  type="button"
                  className="btn-quick-present"
                  onClick={() => handleQuickMark('Present')}
                  disabled={isSubmitting}
                >
                  <FaCheckCircle />
                  Mark as Present
                </button>
                <button
                  type="button"
                  className="btn-quick-absent"
                  onClick={() => handleQuickMark('Absent')}
                  disabled={isSubmitting}
                >
                  <FaTimesCircle />
                  Mark as Absent
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting || availableEmployees.length === 0}
          >
            {isSubmitting ? (
              <>
                <div className="spinner-small"></div>
                Marking Attendance...
              </>
            ) : (
              <>
                <FaSave />
                Mark Attendance
              </>
            )}
          </button>
        </div>
      </form>

      {todayAttendance.length > 0 && (
        <div className="today-attendance-preview">
          <h4>Today's Attendance ({format(new Date(formData.date), 'MMM dd, yyyy')})</h4>
          <div className="attendance-summary">
            <div className="summary-item present">
              <span className="summary-count">
                {todayAttendance.filter(a => a.status === 'Present').length}
              </span>
              <span className="summary-label">Present</span>
            </div>
            <div className="summary-item absent">
              <span className="summary-count">
                {todayAttendance.filter(a => a.status === 'Absent').length}
              </span>
              <span className="summary-label">Absent</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceForm;