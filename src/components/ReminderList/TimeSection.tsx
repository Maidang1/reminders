import React from 'react';
import { Reminder } from '../../types';
import { ReminderItem } from './ReminderItem';

interface TimeSectionProps {
  title: string;
  reminders: Reminder[];
  onCancelReminder: (reminderId: string) => void;
}

export const TimeSection: React.FC<TimeSectionProps> = ({
  title,
  reminders,
  onCancelReminder,
}) => {
  if (reminders.length === 0) {
    return null;
  }

  return (
    <div className="time-section">
      <h3 className="time-section-title">{title}</h3>
      <div className="reminders-list">
        {reminders.map((reminder) => (
          <ReminderItem
            key={reminder.id}
            reminder={reminder}
            onCancel={onCancelReminder}
          />
        ))}
      </div>
    </div>
  );
};
