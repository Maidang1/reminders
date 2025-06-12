import React from 'react';
import { motion } from 'motion/react';
import { ReminderGroup } from '../../types';
import { Badge } from '../shared/Badge';
import { IconButton } from '../shared/IconButton';

interface GroupItemProps {
  group: ReminderGroup;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  animationDelay?: number;
  reminderCount?: number;
}

export const GroupItem: React.FC<GroupItemProps> = ({
  group,
  isSelected,
  onSelect,
  onDelete,
  animationDelay = 0,
  reminderCount = 1
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: animationDelay }}
      className="relative group"
    >
      <button
        onClick={onSelect}
        className={`apple-sidebar-item ${isSelected ? 'selected' : ''}`}
      >
        <div className="apple-sidebar-item-content">
          <div 
            className="w-6 h-6 rounded-lg mr-3 flex items-center justify-center"
            style={{ backgroundColor: group.color }}
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <span>{group.name}</span>
        </div>
        <Badge count={reminderCount} />
      </button>
      
      <IconButton
        onClick={onDelete}
        variant="danger"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        }
      />
    </motion.div>
  );
};
