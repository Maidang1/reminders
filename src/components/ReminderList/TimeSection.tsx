import React from 'react';
import { Reminder } from '../../types';
import { ReminderItem } from './ReminderItem';

interface TimeSectionProps {
  title: string;
  reminders: Reminder[];
  onCancelReminder: (reminderId: string) => void;
  getGroupName: (groupId: string) => string;
  formatDate: (timestamp: number) => string;
}

export const TimeSection: React.FC<TimeSectionProps> = ({
  title,
  reminders,
  onCancelReminder,
  getGroupName,
  formatDate,
}) => {
  if (reminders.length === 0) {
    return (
      <div className="apple-time-section">
        <h3 className="apple-time-header">{title}</h3>
        <div className="h-px bg-gray-700 w-full"></div>
      </div>
    );
  }

  return (
    <div className="apple-time-section">
      <h3 className="apple-time-header">{title}</h3>
      <div className="space-y-2">
        {reminders.map((reminder) => (
          <ReminderItem
            key={reminder.id}
            reminder={reminder}
            onCancel={onCancelReminder}
            getGroupName={getGroupName}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>
  );
};
