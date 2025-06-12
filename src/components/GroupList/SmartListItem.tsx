import React from 'react';
import { motion } from 'motion/react';
import { Badge } from '../shared/Badge';

interface SmartListItemProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  bgColor: string;
  isSelected?: boolean;
  onClick: () => void;
  animationDelay?: number;
}

export const SmartListItem: React.FC<SmartListItemProps> = ({
  icon,
  label,
  count,
  bgColor,
  isSelected = false,
  onClick,
  animationDelay = 0
}) => {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: animationDelay }}
      onClick={onClick}
      className={`apple-sidebar-item ${isSelected ? 'selected' : ''}`}
    >
      <div className="apple-sidebar-item-content">
        <div className={`w-6 h-6 ${bgColor} rounded-lg flex items-center justify-center mr-3`}>
          {icon}
        </div>
        <span>{label}</span>
      </div>
      <Badge count={count} />
    </motion.button>
  );
};
