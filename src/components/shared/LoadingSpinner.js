import React from 'react';
import '../../styles/LoadingSpinner.css';

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-spinner">
      <div className="loading-spinner__circle" />
      {message && <p className="loading-spinner__message">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;
