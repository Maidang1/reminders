export interface ReminderGroup {
  id: string;
  name: string;
  color: string;
  created_at: number;
}

export interface Reminder {
  id: string;
  title: string;
  color: string;
  group_id: string;
  repeat_interval: number; // in seconds
  repeat_duration: number; // in seconds, how long to repeat
  created_at: number;
  last_triggered?: number;
  is_cancelled: boolean;
  next_trigger: number;
}

export interface CreateReminderData {
  title: string;
  color: string;
  group_id: string;
  repeat_interval: number;
  repeat_duration: number;
}

export interface CreateGroupData {
  name: string;
  color: string;
}
