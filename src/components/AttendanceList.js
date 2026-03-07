import React, { useState } from 'react';
import { format, parseISO, isToday, isYesterday, isThisWeek, isSameMonth } from 'date-fns';
import { 
  FaCalendar, 
  FaUser, 
  FaCalendarCheck, 
  FaCalendarTimes,
  FaFilter,
  FaSort,
  FaDownload,
  FaPrint,
  FaSearch
} from 'react-icons/fa';
import '../styles/AttendanceList.css';

function AttendanceList({ attendance, employee, showEmployeeColumn = true }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  if (!attendance || attendance.length === 0) {
    return (
      <div className="attendance-empty">
        <div className="empty-icon">
          <FaCalendar />
        </div>
        <h3>No Attendance Records</h3>
        <p>No attendance has been marked yet for this employee</p>
      </div>
    );
  }

  // Calculate statistics
  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === 'Present').length;
  const absentDays = attendance.filter(a => a.status === 'Absent').length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  // Filter attendance
  const filteredAttendance = attendance
    .filter(record => {
      // Search filter
      if (searchTerm && !record.employee_id.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filterStatus && record.status !== filterStatus) {
        return false;
      }
      
      // Date range filter
      const recordDate = parseISO(record.date);
      switch (filterDateRange) {
        case 'today':
          return isToday(recordDate);
        case 'yesterday':
          return isYesterday(recordDate);
        case 'thisWeek':
          return isThisWeek(recordDate);
        case 'thisMonth':
          return isSameMonth(recordDate, new Date());
        case 'lastMonth':
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return isSameMonth(recordDate, lastMonth);
        default:
          return true;
      }
    });

  // Sort attendance
  const sortedAttendance = [...filteredAttendance].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortConfig.key === 'status') {
      const statusA = a.status;
      const statusB = b.status;
      if (statusA === statusB) return 0;
      if (sortConfig.direction === 'asc') {
        return statusA < statusB ? -1 : 1;
      } else {
        return statusA > statusB ? -1 : 1;
      }
    }
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Employee ID', 'Name', 'Status', 'Day'],
      ...attendance.map(record => [
        record.date,
        record.employee_id,
        employee?.full_name || '',
        record.status,
        format(parseISO(record.date), 'EEEE')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${employee?.employee_id || 'all'}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="attendance-list-container">
      {employee && (
        <div className="attendance-header">
          <div className="employee-profile">
            <div className="profile-avatar">
              {employee.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h3>{employee.full_name}</h3>
              <p className="employee-meta">
                <span className="employee-id">ID: {employee.employee_id}</span>
                <span className="separator">•</span>
                <span className="employee-dept">{employee.department}</span>
              </p>
            </div>
          </div>
          
          <div className="attendance-stats">
            <div className="stat-card">
              <div className="stat-icon total">
                <FaCalendar />
              </div>
              <div className="stat-details">
                <div className="stat-value">{totalDays}</div>
                <div className="stat-label">Total Days</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon present">
                <FaCalendarCheck />
              </div>
              <div className="stat-details">
                <div className="stat-value">{presentDays}</div>
                <div className="stat-label">Present</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon absent">
                <FaCalendarTimes />
              </div>
              <div className="stat-details">
                <div className="stat-value">{absentDays}</div>
                <div className="stat-label">Absent</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon rate">
                <div className="rate-circle">
                  {attendanceRate}%
                </div>
              </div>
              <div className="stat-details">
                <div className="stat-value">{attendanceRate}%</div>
                <div className="stat-label">Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="list-controls">
        <div className="search-control">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          
          <div className="filter-group">
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>
          
          <div className="action-buttons">
            <button className="btn-action btn-export" onClick={handleExport}>
              <FaDownload />
              Export
            </button>
            <button className="btn-action btn-print" onClick={handlePrint}>
              <FaPrint />
              Print
            </button>
          </div>
        </div>
      </div>

      <div className="attendance-summary-bar">
        <div className="summary-info">
          Showing {sortedAttendance.length} of {attendance.length} records
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
        {sortedAttendance.length === 0 && (
          <button
            className="btn-clear-filters"
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('');
              setFilterDateRange('all');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th 
                className="sortable"
                onClick={() => handleSort('date')}
              >
                <div className="sort-header">
                  Date
                  <span className="sort-icon">{getSortIcon('date')}</span>
                </div>
              </th>
              <th>Day</th>
              {showEmployeeColumn && <th>Employee</th>}
              <th 
                className="sortable"
                onClick={() => handleSort('status')}
              >
                <div className="sort-header">
                  Status
                  <span className="sort-icon">{getSortIcon('status')}</span>
                </div>
              </th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {sortedAttendance.map((record, index) => {
              const recordDate = parseISO(record.date);
              const isTodayDate = isToday(recordDate);
              
              return (
                <tr 
                  key={`${record.employee_id}-${record.date}`}
                  className={isTodayDate ? 'today-row' : ''}
                >
                  <td>
                    <div className="date-cell">
                      <div className="date-wrapper">
                        <div className="date-day">{format(recordDate, 'dd')}</div>
                        <div className="date-month-year">
                          <div className="date-month">{format(recordDate, 'MMM')}</div>
                          <div className="date-year">{format(recordDate, 'yyyy')}</div>
                        </div>
                      </div>
                      {isTodayDate && (
                        <span className="today-badge">Today</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="day-cell">
                      <span className="day-name">{format(recordDate, 'EEEE')}</span>
                      <span className="day-short">{format(recordDate, 'EEE')}</span>
                    </div>
                  </td>
                  {showEmployeeColumn && (
                    <td>
                      <div className="employee-cell">
                        <div className="employee-avatar">
                          {record.employee_id.charAt(0)}
                        </div>
                        <div className="employee-info">
                          <div className="employee-id">{record.employee_id}</div>
                          {employee && (
                            <div className="employee-name">{employee.full_name}</div>
                          )}
                        </div>
                      </div>
                    </td>
                  )}
                  <td>
                    <span className={`status-badge status-${record.status.toLowerCase()}`}>
                      {record.status === 'Present' ? (
                        <>
                          <FaCalendarCheck className="status-icon" />
                          Present
                        </>
                      ) : (
                        <>
                          <FaCalendarTimes className="status-icon" />
                          Absent
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="remarks-cell">
                      {record.status === 'Present' ? (
                        <span className="remark-present">Regular attendance</span>
                      ) : (
                        <span className="remark-absent">Leave/Absent</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedAttendance.length === 0 && filteredAttendance.length === 0 && (
        <div className="no-results">
          <p>No attendance records found matching your criteria</p>
          <button
            className="btn-clear-all"
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('');
              setFilterDateRange('all');
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}

      <div className="attendance-footer">
        <div className="footer-summary">
          <div className="summary-item">
            <div className="summary-dot present"></div>
            <span>Present: {presentDays}</span>
          </div>
          <div className="summary-item">
            <div className="summary-dot absent"></div>
            <span>Absent: {absentDays}</span>
          </div>
          <div className="summary-item">
            <div className="summary-dot total"></div>
            <span>Total: {totalDays}</span>
          </div>
        </div>
        <div className="footer-actions">
          <span className="last-updated">
            Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AttendanceList;