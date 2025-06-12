import React from 'react';
import { ReminderGroup } from '../../types';
import { GroupItem } from './GroupItem';

interface MyListsSectionProps {
  groups: ReminderGroup[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
}

export const MyListsSection: React.FC<MyListsSectionProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  onDeleteGroup
}) => {
  return (
    <div className="px-4 py-2">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
        My Lists
      </div>
      
      {groups.map((group, index) => (
        <GroupItem
          key={group.id}
          group={group}
          isSelected={selectedGroupId === group.id}
          onSelect={() => onSelectGroup(group.id)}
          onDelete={() => onDeleteGroup(group.id)}
          animationDelay={0.5 + (index * 0.1)}
        />
      ))}
    </div>
  );
};
