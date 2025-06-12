import React from 'react';
import { motion } from 'motion/react';
import { ReminderGroup } from '../../types';

interface ReminderHeaderProps {
  selectedGroupId: string | null;
  selectedGroup?: ReminderGroup;
}

export const ReminderHeader: React.FC<ReminderHeaderProps> = ({
  selectedGroupId,
  selectedGroup
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <h1 className="apple-section-title">
        {selectedGroupId ? selectedGroup?.name || 'Unknown' : 'Today'}
      </h1>
      {!selectedGroupId && (
        <div className="flex items-center text-gray-400 text-sm mb-4">
          <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
          <span>11111111</span>
          <span className="ml-2 text-red-400">Yesterday, 21:00</span>
        </div>
      )}
    </motion.div>
  );
};
