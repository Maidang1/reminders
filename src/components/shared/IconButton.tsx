import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  className = '',
  variant = 'secondary'
}) => {
  const baseClasses = 'p-1 rounded transition-colors duration-200';
  const variantClasses = {
    primary: 'text-blue-400 hover:text-blue-500',
    secondary: 'text-gray-400 hover:text-gray-300',
    danger: 'text-red-400 hover:text-red-500'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {icon}
    </button>
  );
};
