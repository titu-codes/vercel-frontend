import React from 'react';
import '../../styles/EmptyState.css';

function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="empty-state-component">
      {Icon && (
        <div className="empty-state-component__icon">
          <Icon />
        </div>
      )}
      <h3 className="empty-state-component__title">{title}</h3>
      <p className="empty-state-component__message">{message}</p>
      {action && <div className="empty-state-component__action">{action}</div>}
    </div>
  );
}

export default EmptyState;
