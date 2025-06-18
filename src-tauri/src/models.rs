use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReminderGroup {
    pub id: String,
    pub name: String,
    pub color: String,
    pub start_at: i64,
}

impl ReminderGroup {
    pub fn new(name: String, color: String) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            name,
            color,
            start_at: chrono::Utc::now().timestamp(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Reminder {
    pub id: String,
    pub title: String,
    pub color: String,
    pub group_id: String,
    pub cron_expression: Option<String>,
    pub start_at: Option<String>,
    pub last_triggered: Option<i64>,
    pub is_cancelled: bool,
    pub is_deleted: bool,
    pub is_paused: bool,
    pub description: Option<String>,
    pub created_at: Option<String>,
    pub end_at: Option<String>,
}

impl Reminder {
    pub fn new(
        title: String,
        color: String,
        group_id: String,
        cron_expression: Option<String>,
        description: Option<String>,
        start_at: Option<String>,
        end_at: Option<String>,
    ) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            title,
            color,
            group_id,
            start_at,
            last_triggered: None,
            is_cancelled: false,
            is_deleted: false,
            is_paused: false,
            cron_expression,
            description,
            created_at: None,
            end_at,
        }
    }

    pub fn is_active(&self) -> bool {
        !self.is_cancelled && !self.is_deleted && !self.is_paused
    }

    pub fn cancel(&mut self) {
        self.is_cancelled = true;
    }

    pub fn delete(&mut self) {
        self.is_deleted = true;
    }

    pub fn pause(&mut self) {
        self.is_paused = true;
    }

    pub fn resume(&mut self) {
        self.is_paused = false;
    }

    pub fn update_last_triggered(&mut self) {
        self.last_triggered = Some(chrono::Utc::now().timestamp());
    }

    pub fn update(
        &mut self,
        title: Option<String>,
        color: Option<String>,
        cron_expression: Option<String>,
        description: Option<String>,
        start_at: Option<String>,
        end_at: Option<String>,
    ) -> bool {
        let mut schedule_changed = false;

        if let Some(title) = title {
            self.title = title;
        }
        if let Some(color) = color {
            self.color = color;
        }
        if let Some(cron_expression) = cron_expression {
            self.cron_expression = Some(cron_expression);
            schedule_changed = true;
        }
        if let Some(description) = description {
            self.description = Some(description);
        }
        if let Some(start_at) = start_at {
            self.start_at = Some(start_at);
            schedule_changed = true;
        }
        if let Some(end_at) = end_at {
            self.end_at = Some(end_at);
            schedule_changed = true;
        }

        schedule_changed
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateReminderRequest {
    pub title: String,
    pub color: String,
    pub group_id: String,
    pub cron_expression: Option<String>,
    pub description: Option<String>,
    pub start_at: Option<String>,
    pub end_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateReminderRequest {
    pub title: Option<String>,
    pub color: Option<String>,
    pub cron_expression: Option<String>,
    pub description: Option<String>,
    pub start_at: Option<String>,
    pub end_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateGroupRequest {
    pub name: String,
    pub color: String,
}
