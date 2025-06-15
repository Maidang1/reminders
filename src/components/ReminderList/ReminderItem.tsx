import React from 'react';
import { Reminder } from '../../types';
import { IconButton } from '../shared/IconButton';

interface ReminderItemProps {
  reminder: Reminder;
  onCancel: (reminderId: string) => void;
  getGroupName: (groupId: string) => string;
  formatDate: (timestamp: number) => string;
  showGroupName?: boolean;
}

export const ReminderItem: React.FC<ReminderItemProps> = ({
  reminder,
  onCancel,
  getGroupName,
  formatDate,
  showGroupName = true
}) => {
  return (
    <div className="apple-reminder-item">
      <div 
        className="apple-reminder-checkbox"
        style={{ borderColor: reminder.color }}
      />
      <div className="apple-reminder-content">
        <div className="apple-reminder-title">{reminder.title}</div>
        <div className="apple-reminder-meta">
          {formatDate(reminder.start_at)}
          {showGroupName && ` • ${getGroupName(reminder.group_id)}`}
          {reminder.cron_expression && ` • Cron: ${reminder.cron_expression}`}
          {reminder.description && ` • ${reminder.description}`}
          {reminder.is_cancelled && ' • 已取消'}
          {reminder.is_paused && ' • 已暂停'}
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
    </div>
  );
};
