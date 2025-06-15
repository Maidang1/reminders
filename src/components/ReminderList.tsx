import React, { useState } from 'react';
import { Reminder, ReminderGroup, CreateReminderData } from '../types';
import { ReminderHeader } from './ReminderList/ReminderHeader';
import { TimeSection } from './ReminderList/TimeSection';
import { ReminderItem } from './ReminderList/ReminderItem';
import { QuickAddForm } from './ReminderList/QuickAddForm';
import { DetailedAddForm } from './ReminderList/DetailedAddForm';
import { COLOR_OPTIONS } from '../constants/options';
import { useFormatters } from '../hooks/useFormatters';
import { useFormState } from '../hooks/useFormState';

interface ReminderListProps {
  reminders: Reminder[];
  groups: ReminderGroup[];
  selectedGroupId: string | null;
  onCreateReminder: (data: CreateReminderData) => void;
  onCancelReminder: (reminderId: string) => void;
}

export const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  groups,
  selectedGroupId,
  onCreateReminder,
  onCancelReminder,
}) => {
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  
  const { formatDate } = useFormatters();
  
  const { formData, updateFormData, resetForm } = useFormState({
    title: '',
    color: COLOR_OPTIONS[0],
    group_id: selectedGroupId || (groups[0]?.id || ''),
    cron_expression: '',
    description: '',
  });

  const filteredReminders = selectedGroupId
    ? reminders.filter(r => r.group_id === selectedGroupId)
    : reminders;

  const getGroupName = (groupId: string) => {
    return groups.find(g => g.id === groupId)?.name || '未知分组';
  };

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

  const groupRemindersByTime = (reminders: Reminder[]) => {
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
  };

  const selectedTimeGroups = groupRemindersByTime(filteredReminders);
  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  return (
    <div className="flex-1 apple-main-content apple-scrollbar overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <ReminderHeader
          selectedGroupId={selectedGroupId}
          selectedGroup={selectedGroup}
        />

        {/* Time Sections for Today view */}
        {!selectedGroupId && (
          <div className="space-y-8">
            <TimeSection
              title="Morning"
              reminders={selectedTimeGroups.morning}
              onCancelReminder={onCancelReminder}
              getGroupName={getGroupName}
              formatDate={formatDate}
            />
            
            <TimeSection
              title="Afternoon"
              reminders={selectedTimeGroups.afternoon}
              onCancelReminder={onCancelReminder}
              getGroupName={getGroupName}
              formatDate={formatDate}
            />
            
            <TimeSection
              title="Tonight"
              reminders={selectedTimeGroups.tonight}
              onCancelReminder={onCancelReminder}
              getGroupName={getGroupName}
              formatDate={formatDate}
            />
          </div>
        )}

        {/* Selected Group Reminders */}
        {selectedGroupId && (
          <div className="space-y-3">
            {filteredReminders.map((reminder) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onCancel={onCancelReminder}
                getGroupName={getGroupName}
                formatDate={formatDate}
                showGroupName={false}
              />
            ))}
          </div>
        )}

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
            className="mt-4 apple-button apple-button-secondary w-full"
          >
            添加详细设置
          </button>
        )}
      </div>
    </div>
  );
};
