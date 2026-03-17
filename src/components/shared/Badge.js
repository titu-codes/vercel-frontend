import React from 'react';
import { FaCalendarCheck, FaCalendarTimes } from 'react-icons/fa';
import '../../styles/Badge.css';

function Badge({ status }) {
  const isPresent = status?.toLowerCase() === 'present';
  return (
    <span className={`badge badge--${isPresent ? 'present' : 'absent'}`}>
      {isPresent ? (
        <>
          <FaCalendarCheck className="badge__icon" />
          Present
        </>
      ) : (
        <>
          <FaCalendarTimes className="badge__icon" />
          Absent
        </>
      )}
    </span>
  );
}

export default Badge;
