import React from 'react';
import { ReminderGroup, Reminder } from '../../types';
import { GroupItem } from './GroupItem';

interface MyListsSectionProps {
  groups: ReminderGroup[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  reminders: Reminder[];
}

export const MyListsSection: React.FC<MyListsSectionProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  onDeleteGroup,
  reminders
}) => {
  const getReminderCount = (groupId: string) => {
    return reminders.filter(r => r.group_id === groupId && !r.is_deleted && !r.is_cancelled).length;
  };

  return (
    <div className="px-4 py-2">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
        My Lists
      </div>
      
      {groups.map((group) => (
        <GroupItem
          key={group.id}
          group={group}
          isSelected={selectedGroupId === group.id}
          onSelect={() => onSelectGroup(group.id)}
          onDelete={() => onDeleteGroup(group.id)}
          reminderCount={getReminderCount(group.id)}
        />
      ))}
    </div>
  );
};
