import React, { useState } from 'react';
import { ReminderGroup, Reminder } from '../types';
import { SearchBox } from './shared/SearchBox';
import { SmartListItem } from './GroupList/SmartListItem';
import { MyListsSection } from './GroupList/MyListsSection';
import { CreateGroupForm } from './GroupList/CreateGroupForm';
import { AddListButton } from './GroupList/AddListButton';
import { COLOR_OPTIONS } from '../constants/options';
import { useFormState } from '../hooks/useFormState';
import { useFormatters } from '../hooks/useFormatters';

interface GroupListProps {
  groups: ReminderGroup[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
  onCreateGroup: (name: string, color: string) => void;
  onDeleteGroup: (groupId: string) => void;
  reminders: Reminder[];
  onCancelReminder: (reminderId: string) => void;
}

export const GroupList: React.FC<GroupListProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  onCreateGroup,
  onDeleteGroup,
  reminders,
  onCancelReminder,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { formData, updateField, resetForm } = useFormState({
    name: '',
    color: COLOR_OPTIONS[0]
  });
  
  const { formatDate } = useFormatters();

  const handleCreateGroup = () => {
    if (formData.name.trim()) {
      onCreateGroup(formData.name.trim(), formData.color);
      resetForm({ name: '', color: COLOR_OPTIONS[0] });
      setShowCreateForm(false);
    }
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    resetForm({ name: '', color: COLOR_OPTIONS[0] });
  };

  return (
    <div className="w-80 apple-sidebar flex flex-col h-full apple-scrollbar">
      {/* Search Box */}
      <SearchBox placeholder="Search" />

      {/* Smart Lists */}
      <div className="px-4 pb-4">
        <SmartListItem
          icon={
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          }
          label="Today"
          count={1}
          bgColor="bg-slate-400"
          isSelected={selectedGroupId === null}
          onClick={() => onSelectGroup(null)}
          animationDelay={0}
        />

        <SmartListItem
          icon={
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          }
          label="Scheduled"
          count={1}
          bgColor="bg-red-500"
          onClick={() => {}}
          animationDelay={0.1}
        />

        <SmartListItem
          icon={
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          }
          label="All"
          count={1}
          bgColor="bg-gray-600"
          onClick={() => {}}
          animationDelay={0.2}
        />

        <SmartListItem
          icon={
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
            </svg>
          }
          label="Flagged"
          count={0}
          bgColor="bg-orange-500"
          onClick={() => {}}
          animationDelay={0.3}
        />

        <SmartListItem
          icon={
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          }
          label="Completed"
          count={0}
          bgColor="bg-gray-600"
          onClick={() => {}}
          animationDelay={0.4}
        />
      </div>

      {/* My Lists Section */}
      <MyListsSection
        groups={groups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={onSelectGroup}
        onDeleteGroup={onDeleteGroup}
        reminders={reminders}
      />

      {/* Selected Group Reminders */}
      {selectedGroupId && (
        <div className="mx-4 mb-4">
          <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
            提醒事项
          </div>
          <div className="space-y-2">
            {reminders
              .filter(r => r.group_id === selectedGroupId && !r.is_deleted)
              .map((reminder) => (
                <div
                  key={reminder.id}
                  className="apple-reminder-item p-2 text-sm"
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: reminder.color }}
                  />
                  <div className="flex-1">
                    <div className="apple-reminder-title text-xs">{reminder.title}</div>
                    {reminder.description && (
                      <div className="text-xs text-gray-400 mt-1">{reminder.description}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(reminder.start_at)}
                      {reminder.cron_expression && ` • ${reminder.cron_expression}`}
                      {reminder.is_cancelled && ' • 已取消'}
                      {reminder.is_paused && ' • 已暂停'}
                    </div>
                  </div>
                  {!reminder.is_cancelled && (
                    <button
                      onClick={() => onCancelReminder(reminder.id)}
                      className="text-red-400 hover:text-red-600 text-xs ml-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Create Group Form */}
      <CreateGroupForm
        isVisible={showCreateForm}
        groupName={formData.name}
        selectedColor={formData.color}
        colorOptions={COLOR_OPTIONS}
        onGroupNameChange={(name) => updateField('name', name)}
        onColorChange={(color) => updateField('color', color)}
        onCreate={handleCreateGroup}
        onCancel={handleCancelCreate}
      />

      {/* Add List Button */}
      <AddListButton onClick={() => setShowCreateForm(true)} />
    </div>
  );
};
