import React from 'react';
import '../../styles/StatCard.css';

function StatCard({ icon: Icon, label, value, variant = 'default', trend }) {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <div className="stat-card__icon">
        <Icon />
      </div>
      <div className="stat-card__content">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
        {trend !== undefined && (
          <span className={`stat-card__trend stat-card__trend--${trend >= 0 ? 'up' : 'down'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
