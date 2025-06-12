import React from 'react';

interface BadgeProps {
  count: number;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ count, className = '' }) => {
  if (count === 0) return null;
  
  return (
    <span className={`apple-sidebar-badge ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  );
};
