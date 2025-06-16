import { useMemo } from 'react';
import { Reminder } from '../types';

export const useTimeGrouping = (reminders: Reminder[]) => {
  return useMemo(() => {
    const groupedReminders: Record<string, Reminder[]> = {};
    
    if (reminders.length === 0) {
      return { groupedReminders };
    }

    // 按日期和时间段分组
    reminders.forEach(reminder => {
      const reminderDate = new Date(reminder.start_at * 1000);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      let timeKey = '';
      
      // 判断日期
      if (reminderDate.toDateString() === today.toDateString()) {
        // 今天的提醒按时间段分组
        const hour = reminderDate.getHours();
        if (hour < 12) {
          timeKey = '今天上午';
        } else if (hour < 17) {
          timeKey = '今天下午';
        } else {
          timeKey = '今天晚上';
        }
      } else if (reminderDate.toDateString() === tomorrow.toDateString()) {
        // 明天的提醒
        const hour = reminderDate.getHours();
        if (hour < 12) {
          timeKey = '明天上午';
        } else if (hour < 17) {
          timeKey = '明天下午';
        } else {
          timeKey = '明天晚上';
        }
      } else if (reminderDate > tomorrow) {
        // 未来的提醒
        timeKey = reminderDate.toLocaleDateString('zh-CN', { 
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
        });
      } else {
        // 过期的提醒
        timeKey = '已过期';
      }
      
      if (!groupedReminders[timeKey]) {
        groupedReminders[timeKey] = [];
      }
      groupedReminders[timeKey].push(reminder);
    });

    // 排序每个组内的提醒
    Object.keys(groupedReminders).forEach(key => {
      groupedReminders[key].sort((a, b) => a.start_at - b.start_at);
    });

    return { groupedReminders };
  }, [reminders]);
};
