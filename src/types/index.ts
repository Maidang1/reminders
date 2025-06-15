export interface ReminderGroup {
  id: string;
  name: string;
  color: string;
  start_at: number;
}

export interface Reminder {
  id: string;
  title: string;
  color: string;
  group_id: string;
  cron_expression?: string;
  start_at: number;
  last_triggered?: number;
  is_cancelled: boolean;
  is_deleted: boolean;
  is_paused: boolean;
  description?: string;
}

export interface CreateReminderData {
  title: string;
  color: string;
  group_id: string;
  cron_expression?: string;
  description?: string;
}

export interface CreateGroupData {
  name: string;
  color: string;
}
