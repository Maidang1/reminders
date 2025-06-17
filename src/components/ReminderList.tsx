import React from 'react';
import { Reminder } from '../types';
import { TimeSection } from './ReminderList/TimeSection';
import { useTimeGrouping } from '../hooks/useTimeGrouping';
import Drink from '../assets/drink.png'; // Assuming you have an icon for empty state

interface ReminderListProps {
  reminders: Reminder[];
  onCancelReminder: (reminderId: string) => void;
}

export const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  onCancelReminder,
}) => {
  const activeReminders = reminders.filter(
    (r) => !r.is_cancelled && !r.is_deleted
  );
  const { groupedReminders } = useTimeGrouping(activeReminders);

  return (
    <div className='reminder-list-container'>
      <div className='reminder-list-content'>
        {/* 页面标题 */}
        <div className='page-header'>
          <h1 className='page-title'>我的提醒</h1>
          <div className='reminder-count'>{activeReminders.length} 个提醒</div>
        </div>

        {/* 提醒列表 */}
        {activeReminders.length === 0 ? (
          <div className='empty-state'>
            <div className='empty-icon'>
              <img src={Drink} alt='Drink' />
            </div>
            <h2 className='empty-title'>还没有提醒事项</h2>
            <p className='empty-subtitle'>
              点击右下角的 + 按钮来添加第一个提醒
            </p>
          </div>
        ) : (
          <div className='reminders-content'>
            {Object.entries(groupedReminders).map(
              ([timeKey, timeReminders]) => (
                <TimeSection
                  key={timeKey}
                  title={timeKey}
                  reminders={timeReminders}
                  onCancelReminder={onCancelReminder}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
