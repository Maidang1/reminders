import React from 'react';
import { motion } from 'motion/react';
import { Reminder } from '../../types';
import { IconButton } from '../shared/IconButton';

interface ReminderItemProps {
  reminder: Reminder;
  onCancel: (reminderId: string) => void;
  getGroupName: (groupId: string) => string;
  formatDate: (timestamp: number) => string;
  formatTime?: (seconds: number) => string;
  showGroupName?: boolean;
  animationDelay?: number;
}

export const ReminderItem: React.FC<ReminderItemProps> = ({
  reminder,
  onCancel,
  getGroupName,
  formatDate,
  formatTime,
  showGroupName = true,
  animationDelay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: animationDelay }}
      className="apple-reminder-item"
    >
      <div 
        className="apple-reminder-checkbox"
        style={{ borderColor: reminder.color }}
      />
      <div className="apple-reminder-content">
        <div className="apple-reminder-title">{reminder.title}</div>
        <div className="apple-reminder-meta">
          {formatDate(reminder.created_at)}
          {showGroupName && ` • ${getGroupName(reminder.group_id)}`}
          {formatTime && ` • 重复: ${formatTime(reminder.repeat_interval)}`}
        </div>
      </div>
      {!reminder.is_cancelled && (
        <IconButton
          onClick={() => onCancel(reminder.id)}
          variant="danger"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          }
        />
      )}
    </motion.div>
  );
};
