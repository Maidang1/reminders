import { invoke } from '@tauri-apps/api/core';
import { ReminderGroup, Reminder, CreateGroupData, CreateReminderData } from '../types';

export const useReminderAPI = () => {
  const getGroups = async (): Promise<ReminderGroup[]> => {
    return await invoke('get_groups');
  };

  const createGroup = async (data: CreateGroupData): Promise<ReminderGroup> => {
    return await invoke('create_group', {
      name: data.name,
      color: data.color,
    });
  };

  const deleteGroup = async (groupId: string): Promise<void> => {
    return await invoke('delete_group', { group_id: groupId });
  };

  const getReminders = async (): Promise<Reminder[]> => {
    return await invoke('get_reminders');
  };

  const createReminder = async (data: CreateReminderData): Promise<Reminder> => {
    return await invoke('create_reminder', {
      title: data.title,
      color: data.color,
      groupId: data.group_id,
      cronExpression: data.cron_expression,
      description: data.description,
    });
  };

  const cancelReminder = async (reminderId: string): Promise<void> => {
    return await invoke('cancel_reminder', { reminder_id: reminderId });
  };

  return {
    getGroups,
    createGroup,
    deleteGroup,
    getReminders,
    createReminder,
    cancelReminder,
  };
};
