import axios from 'axios';

// Production: always use Railway backend. Local: use env var or localhost
const RAILWAY_BACKEND = 'https://verccel-backend-production.up.railway.app';
const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? RAILWAY_BACKEND
    : (process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee APIs
export const employeeAPI = {
  getAll: () => api.get('/employees/'),
  getById: (employeeId) => api.get(`/employees/${employeeId}`),
  create: (employeeData) => api.post('/employees/', employeeData),
  delete: (employeeId) => api.delete(`/employees/${employeeId}`),
};

// Attendance APIs
export const attendanceAPI = {
  mark: (attendanceData) => api.post('/attendance/', attendanceData),
  getByEmployee: (employeeId) => api.get(`/attendance/employee/${employeeId}`),
  getByDate: (date) => api.get(`/attendance/date/${date}`),
};

// Analytics APIs - reference_date uses user's local date, _t prevents caching
export const analyticsAPI = {
  getDashboard: (days = 7, referenceDate = null) => {
    const today = referenceDate || new Date().toISOString().slice(0, 10);
    return api.get(`/analytics/dashboard?days=${days}&reference_date=${today}&_t=${Date.now()}`);
  },
};

export default api;