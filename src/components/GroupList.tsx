import React, { useState } from 'react';
import { ReminderGroup } from '../types';
import ShimmerButton from './magicui/shimmer-button';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="w-80 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 p-4 flex flex-col h-full shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-gray-800"
        >
          分组
        </motion.h2>
        <ShimmerButton
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 text-sm"
          background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          shimmerColor="#ffffff"
        >
          <span className="text-white font-medium">+ 添加分组</span>
        </ShimmerButton>
      </div>

      <AnimatePresence>
        {showCreateForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-4 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg"
          >
            <motion.input
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              type="text"
              placeholder="分组名称"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              autoFocus
            />
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-3 block font-medium">选择颜色:</label>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-3"
              >
                {colorOptions.map((color, index) => (
                  <motion.button
                    key={color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 * index, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-3 transition-all duration-200 ${
                      selectedColor === color ? 'border-gray-800 shadow-lg ring-2 ring-gray-300' : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-3"
            >
              <ShimmerButton
                onClick={handleCreateGroup}
                className="flex-1 py-2 text-sm"
                background="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                shimmerColor="#ffffff"
              >
                <span className="text-white font-medium">创建</span>
              </ShimmerButton>
              <motion.button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewGroupName('');
                  setSelectedColor(colorOptions[0]);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm flex-1 font-medium"
              >
                取消
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3 flex-1 overflow-y-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectGroup(null)}
          className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
            selectedGroupId === null
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
              : 'bg-white/70 hover:bg-white/90 border border-gray-200/50 text-gray-800 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="font-medium">全部提醒</div>
        </motion.button>

        {groups.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
            whileHover={{ scale: 1.02, x: 4 }}
            className={`relative group rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${
              selectedGroupId === group.id
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white transform scale-105'
                : 'bg-white/70 hover:bg-white/90 border border-gray-200/50'
            }`}
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectGroup(group.id)}
              className="w-full text-left p-4 pr-12"
            >
              <div className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-4 h-4 rounded-full mr-3 shadow-sm"
                  style={{ backgroundColor: group.color }}
                />
                <div className={`font-medium ${selectedGroupId === group.id ? 'text-white' : 'text-gray-800'}`}>
                  {group.name}
                </div>
              </div>
            </motion.button>
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0, scale: 0 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              onClick={() => onDeleteGroup(group.id)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 group-hover:opacity-100 transition-all duration-200 p-1 rounded-full hover:bg-red-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
