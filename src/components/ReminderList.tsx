import React, { useState } from 'react';
import { Reminder, ReminderGroup, CreateReminderData } from '../types';
import { ReminderHeader } from './ReminderList/ReminderHeader';
import { QuickAddForm } from './ReminderList/QuickAddForm';
import { DetailedAddForm } from './ReminderList/DetailedAddForm';
import { COLOR_OPTIONS } from '../constants/options';
import { useFormState } from '../hooks/useFormState';

interface ReminderListProps {
  reminders: Reminder[];
  groups: ReminderGroup[];
  selectedGroupId: string | null;
  onCreateReminder: (data: CreateReminderData) => void;
  onCancelReminder: (reminderId: string) => void;
}

export const ReminderList: React.FC<ReminderListProps> = ({
  groups,
  selectedGroupId,
  onCreateReminder,
  reminders
}) => {
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  
  const { formData, updateFormData, resetForm } = useFormState({
    title: '',
    color: COLOR_OPTIONS[0],
    group_id: selectedGroupId || (groups[0]?.id || ''),
    cron_expression: '',
    description: '',
  });

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  const handleQuickAdd = () => {
    if (newReminderTitle.trim() && (selectedGroupId || groups[0]?.id)) {
      onCreateReminder({
        title: newReminderTitle.trim(),
        color: COLOR_OPTIONS[0],
        group_id: selectedGroupId || groups[0].id,
        cron_expression: undefined,
        description: undefined,
      });
      setNewReminderTitle('');
    }
  };

  const handleDetailedAdd = () => {
    if (formData.title.trim() && formData.group_id) {
      onCreateReminder({
        title: formData.title.trim(),
        color: formData.color,
        group_id: formData.group_id,
        cron_expression: formData.cron_expression || undefined,
        description: formData.description || undefined,
      });
      resetForm({
        title: '',
        color: COLOR_OPTIONS[0],
        group_id: selectedGroupId || (groups[0]?.id || ''),
        cron_expression: '',
        description: '',
      });
      setShowDetails(false);
    }
  };

  const handleCancelDetailed = () => {
    setShowDetails(false);
    resetForm({
      title: '',
      color: COLOR_OPTIONS[0],
      group_id: selectedGroupId || (groups[0]?.id || ''),
      cron_expression: '',
      description: '',
    });
  };

  return (
    <div className="flex-1 apple-main-content apple-scrollbar overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <ReminderHeader
          selectedGroupId={selectedGroupId}
          selectedGroup={selectedGroup}
        />
        {
          reminders.map((reminder) => (
            <div key={reminder.id} className="mb-4">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: reminder.color }}
                />
                <div className="flex-1">
                  <div className="font-semibold">{reminder.title}</div>
                  <div className="text-sm text-gray-500">
                    {reminder.description}
                  </div>
                </div>
              </div>
            </div>
          ))
        }

        {/* 未选择组时显示欢迎界面 */}
        {!selectedGroupId && (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">欢迎使用提醒助手</h2>
            <p className="text-gray-500 mb-6">选择左侧的列表开始创建提醒事项</p>
            <div className="text-sm text-gray-400">
              或者创建一个新的列表来组织您的提醒
            </div>
          </div>
        )}

        {/* 选择组时显示创建表单 */}
        {selectedGroupId && (
          <div className="space-y-6">
            {/* Quick Add Form */}
            <QuickAddForm
              value={newReminderTitle}
              onChange={setNewReminderTitle}
              onSubmit={handleQuickAdd}
            />

            {/* Detailed Add Form */}
            <DetailedAddForm
              isVisible={showDetails}
              formData={formData}
              groups={groups}
              colorOptions={COLOR_OPTIONS}
              onFormDataChange={updateFormData}
              onSubmit={handleDetailedAdd}
              onCancel={handleCancelDetailed}
            />

            {/* Add Details Button */}
            {!showDetails && (
              <button
                onClick={() => setShowDetails(true)}
                className="apple-button apple-button-secondary w-full"
              >
                添加详细设置
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
