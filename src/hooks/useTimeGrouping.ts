import { useMemo } from 'react';
import { Reminder } from '../types';

export const useTimeGrouping = (reminders: Reminder[]) => {
  return useMemo(() => {
    return {
      morning: reminders.filter(r => {
        const reminderDate = new Date(r.start_at * 1000);
        return reminderDate.getHours() < 12;
      }),
      afternoon: reminders.filter(r => {
        const reminderDate = new Date(r.start_at * 1000);
        return reminderDate.getHours() >= 12 && reminderDate.getHours() < 17;
      }),
      tonight: reminders.filter(r => {
        const reminderDate = new Date(r.start_at * 1000);
        return reminderDate.getHours() >= 17;
      })
    };
  }, [reminders]);
};
