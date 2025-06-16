import React from 'react';
import { Reminder } from '../../types';
import { useFormatters } from '../../hooks/useFormatters';

interface ReminderItemProps {
  reminder: Reminder;
  onCancel: (reminderId: string) => void;
}

export const ReminderItem: React.FC<ReminderItemProps> = ({
  reminder,
  onCancel,
}) => {
  const { formatDateTime } = useFormatters();

  return (
    <div className="reminder-item">
      <div className="reminder-item-content">
        <div 
          className="reminder-color-dot"
          style={{ backgroundColor: reminder.color }}
        />
        <div className="reminder-details">
          <div className="reminder-title">{reminder.title}</div>
          <div className="reminder-description">
            {formatDateTime(reminder.start_at)}
            {reminder.cron_expression && ` • 重复: ${reminder.cron_expression}`}
            {reminder.description && ` • ${reminder.description}`}
            {reminder.is_cancelled && ' • 已取消'}
            {reminder.is_paused && ' • 已暂停'}
          </div>
        </div>
        <div className="reminder-actions">
          {!reminder.is_cancelled && (
            <button
              onClick={() => onCancel(reminder.id)}
              className="reminder-action-button"
              aria-label="取消提醒"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
