export interface Reminder {
  id: string;
  title: string;
  color: string;
  group_id: string; // 保留，但使用默认值
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
  group_id: string; // 保留，但使用默认值
  cron_expression?: string;
  description?: string;
}

// 保留分组接口以兼容现有API，但在UI中不使用
export interface ReminderGroup {
  id: string;
  name: string;
  color: string;
  start_at: number;
}

export interface CreateGroupData {
  name: string;
  color: string;
}
