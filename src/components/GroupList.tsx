import React, { useState } from 'react';
import { ReminderGroup } from '../types';

interface GroupListProps {
  groups: ReminderGroup[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
  onCreateGroup: (name: string, color: string) => void;
  onDeleteGroup: (groupId: string) => void;
}

const colorOptions = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
];

export const GroupList: React.FC<GroupListProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  onCreateGroup,
  onDeleteGroup,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      onCreateGroup(newGroupName.trim(), selectedColor);
      setNewGroupName('');
      setSelectedColor(colorOptions[0]);
      setShowCreateForm(false);
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">分组</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
        >
          + 添加分组
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <input
            type="text"
            placeholder="分组名称"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="mb-3">
            <label className="text-sm text-gray-600 mb-2 block">选择颜色:</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateGroup}
              className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-sm flex-1"
            >
              创建
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewGroupName('');
                setSelectedColor(colorOptions[0]);
              }}
              className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors text-sm flex-1"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 flex-1 overflow-y-auto">
        <button
          onClick={() => onSelectGroup(null)}
          className={`w-full text-left p-3 rounded-md transition-colors ${
            selectedGroupId === null
              ? 'bg-blue-100 border-l-4 border-blue-500'
              : 'bg-white hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <div className="font-medium text-gray-800">全部提醒</div>
        </button>

        {groups.map((group) => (
          <div
            key={group.id}
            className={`relative group rounded-md transition-colors ${
              selectedGroupId === group.id
                ? 'bg-blue-100 border-l-4'
                : 'bg-white hover:bg-gray-100 border border-gray-200'
            }`}
            style={{
              borderLeftColor: selectedGroupId === group.id ? group.color : 'transparent',
            }}
          >
            <button
              onClick={() => onSelectGroup(group.id)}
              className="w-full text-left p-3 pr-12"
            >
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: group.color }}
                />
                <div className="font-medium text-gray-800">{group.name}</div>
              </div>
            </button>
            <button
              onClick={() => onDeleteGroup(group.id)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
