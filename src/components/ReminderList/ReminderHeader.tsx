import React from 'react';
import { ReminderGroup } from '../../types';

interface ReminderHeaderProps {
  selectedGroupId: string | null;
  selectedGroup?: ReminderGroup;
}

export const ReminderHeader: React.FC<ReminderHeaderProps> = ({
  selectedGroupId,
  selectedGroup
}) => {
  if (!selectedGroupId) {
    return (
      <div className="mb-8">
        <h1 className="apple-section-title">提醒助手</h1>
        <p className="text-gray-500">选择左侧的列表来创建和管理提醒事项</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: selectedGroup?.color || '#6B9BD2' }}
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="apple-section-title">{selectedGroup?.name || '未知列表'}</h1>
      </div>
      <p className="text-gray-500">在此列表中创建新的提醒事项</p>
    </div>
  );
};
