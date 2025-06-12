import React, { useState } from 'react';
import { Reminder, ReminderGroup, CreateReminderData } from '../types';
import { motion } from 'motion/react';
import { ReminderHeader } from './ReminderList/ReminderHeader';
import { TimeSection } from './ReminderList/TimeSection';
import { ReminderItem } from './ReminderList/ReminderItem';
import { QuickAddForm } from './ReminderList/QuickAddForm';
import { DetailedAddForm } from './ReminderList/DetailedAddForm';
import { COLOR_OPTIONS, INTERVAL_OPTIONS } from '../constants/options';
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
  
  const { formatTime, formatDate } = useFormatters();
  
  const { formData, updateFormData, resetForm } = useFormState({
    title: '',
    color: COLOR_OPTIONS[0],
    group_id: selectedGroupId || (groups[0]?.id || ''),
    repeat_interval: 300,
    repeat_duration: 86400,
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
        repeat_interval: 300,
        repeat_duration: 86400,
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
        repeat_interval: formData.repeat_interval,
        repeat_duration: formData.repeat_duration,
      });
      resetForm({
        title: '',
        color: COLOR_OPTIONS[0],
        group_id: selectedGroupId || (groups[0]?.id || ''),
        repeat_interval: 300,
        repeat_duration: 86400,
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
      repeat_interval: 300,
      repeat_duration: 86400,
    });
  };

  const groupRemindersByTime = (reminders: Reminder[]) => {
    return {
      morning: reminders.filter(r => {
        const reminderDate = new Date(r.created_at * 1000);
        return reminderDate.getHours() < 12;
      }),
      afternoon: reminders.filter(r => {
        const reminderDate = new Date(r.created_at * 1000);
        return reminderDate.getHours() >= 12 && reminderDate.getHours() < 17;
      }),
      tonight: reminders.filter(r => {
        const reminderDate = new Date(r.created_at * 1000);
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
              animationDelay={0.2}
            />
            
            <TimeSection
              title="Afternoon"
              reminders={selectedTimeGroups.afternoon}
              onCancelReminder={onCancelReminder}
              getGroupName={getGroupName}
              formatDate={formatDate}
              animationDelay={0.3}
            />
            
            <TimeSection
              title="Tonight"
              reminders={selectedTimeGroups.tonight}
              onCancelReminder={onCancelReminder}
              getGroupName={getGroupName}
              formatDate={formatDate}
              animationDelay={0.4}
            />
          </div>
        )}

        {/* Selected Group Reminders */}
        {selectedGroupId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {filteredReminders.map((reminder, index) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onCancel={onCancelReminder}
                getGroupName={getGroupName}
                formatDate={formatDate}
                formatTime={formatTime}
                showGroupName={false}
                animationDelay={index * 0.1}
              />
            ))}
          </motion.div>
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
          intervalOptions={INTERVAL_OPTIONS}
          onFormDataChange={updateFormData}
          onSubmit={handleDetailedAdd}
          onCancel={handleCancelDetailed}
        />

        {/* Add Details Button */}
        {!showDetails && (
          <motion.button
            onClick={() => setShowDetails(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 apple-button apple-button-secondary w-full"
          >
            添加详细设置
          </motion.button>
        )}
      </div>
    </div>
  );
};
