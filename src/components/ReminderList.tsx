import React, { useState } from 'react';
import { Reminder, ReminderGroup, CreateReminderData } from '../types';

interface ReminderListProps {
  reminders: Reminder[];
  groups: ReminderGroup[];
  selectedGroupId: string | null;
  onCreateReminder: (data: CreateReminderData) => void;
  onCancelReminder: (reminderId: string) => void;
}

const colorOptions = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
];

const intervalOptions = [
  { value: 60, label: '1分钟' },
  { value: 300, label: '5分钟' },
  { value: 900, label: '15分钟' },
  { value: 1800, label: '30分钟' },
  { value: 3600, label: '1小时' },
  { value: 7200, label: '2小时' },
  { value: 86400, label: '1天' },
];

const durationOptions = [
  { value: 3600, label: '1小时' },
  { value: 86400, label: '1天' },
  { value: 604800, label: '1周' },
  { value: 2592000, label: '1个月' },
  { value: 31536000, label: '1年' },
  { value: 0, label: '永久' },
];

export const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  groups,
  selectedGroupId,
  onCreateReminder,
  onCancelReminder,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    color: colorOptions[0],
    group_id: selectedGroupId || (groups[0]?.id || ''),
    repeat_interval: 300,
    repeat_duration: 86400,
  });

  const filteredReminders = selectedGroupId
    ? reminders.filter(r => r.group_id === selectedGroupId)
    : reminders;

  const formatTime = (seconds: number) => {
    if (seconds === 0) return '永久';
    if (seconds < 60) return `${seconds}秒`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时`;
    return `${Math.floor(seconds / 86400)}天`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('zh-CN');
  };

  const getGroupName = (groupId: string) => {
    return groups.find(g => g.id === groupId)?.name || '未知分组';
  };

  const handleCreateReminder = () => {
    if (formData.title.trim() && formData.group_id) {
      onCreateReminder({
        title: formData.title.trim(),
        color: formData.color,
        group_id: formData.group_id,
        repeat_interval: formData.repeat_interval,
        repeat_duration: formData.repeat_duration,
      });
      setFormData({
        title: '',
        color: colorOptions[0],
        group_id: selectedGroupId || (groups[0]?.id || ''),
        repeat_interval: 300,
        repeat_duration: 86400,
      });
      setShowCreateForm(false);
    }
  };

  return (
    <div className="flex-1 p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedGroupId 
            ? `${getGroupName(selectedGroupId)} - 提醒列表`
            : '全部提醒'
          }
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          disabled={groups.length === 0}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          + 创建提醒
        </button>
      </div>

      {groups.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">请先创建一个分组</div>
        </div>
      )}

      {showCreateForm && groups.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">创建新提醒</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">提醒标题</label>
              <input
                type="text"
                placeholder="输入提醒标题"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">选择分组</label>
              <select
                value={formData.group_id}
                onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">重复间隔</label>
              <select
                value={formData.repeat_interval}
                onChange={(e) => setFormData({ ...formData, repeat_interval: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {intervalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">重复时长</label>
              <select
                value={formData.repeat_duration}
                onChange={(e) => setFormData({ ...formData, repeat_duration: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {durationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">选择颜色</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreateReminder}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              创建提醒
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredReminders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">暂无提醒</div>
          </div>
        ) : (
          filteredReminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`p-4 rounded-lg border-l-4 shadow-sm ${
                reminder.is_cancelled 
                  ? 'bg-gray-100 border-gray-400' 
                  : 'bg-white border-gray-300'
              }`}
              style={{ borderLeftColor: reminder.color }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: reminder.color }}
                    />
                    <h3 className={`text-lg font-semibold ${
                      reminder.is_cancelled ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}>
                      {reminder.title}
                    </h3>
                    {reminder.is_cancelled && (
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                        已取消
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>分组: {getGroupName(reminder.group_id)}</div>
                    <div>重复间隔: {formatTime(reminder.repeat_interval)}</div>
                    <div>重复时长: {formatTime(reminder.repeat_duration)}</div>
                    <div>创建时间: {formatDate(reminder.created_at)}</div>
                    {!reminder.is_cancelled && (
                      <div>下次提醒: {formatDate(reminder.next_trigger)}</div>
                    )}
                  </div>
                </div>

                {!reminder.is_cancelled && (
                  <button
                    onClick={() => onCancelReminder(reminder.id)}
                    className="ml-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    取消提醒
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
