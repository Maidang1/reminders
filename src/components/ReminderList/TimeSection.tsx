import React from 'react';
import { motion } from 'motion/react';
import { Reminder } from '../../types';
import { ReminderItem } from './ReminderItem';

interface TimeSectionProps {
  title: string;
  reminders: Reminder[];
  onCancelReminder: (reminderId: string) => void;
  getGroupName: (groupId: string) => string;
  formatDate: (timestamp: number) => string;
  animationDelay?: number;
}

export const TimeSection: React.FC<TimeSectionProps> = ({
  title,
  reminders,
  onCancelReminder,
  getGroupName,
  formatDate,
  animationDelay = 0
}) => {
  if (reminders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: animationDelay }}
        className="apple-time-section"
      >
        <h3 className="apple-time-header">{title}</h3>
        <div className="h-px bg-gray-700 w-full"></div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: animationDelay }}
      className="apple-time-section"
    >
      <h3 className="apple-time-header">{title}</h3>
      <div className="space-y-2">
        {reminders.map((reminder, index) => (
          <ReminderItem
            key={reminder.id}
            reminder={reminder}
            onCancel={onCancelReminder}
            getGroupName={getGroupName}
            formatDate={formatDate}
            animationDelay={index * 0.1}
          />
        ))}
      </div>
    </motion.div>
  );
};
