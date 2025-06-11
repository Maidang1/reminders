import React, { useState } from 'react';
import { Reminder, ReminderGroup, CreateReminderData } from '../types';
import AnimatedList from './magicui/animated-list';
import ShimmerButton from './magicui/shimmer-button';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="flex-1 p-6 bg-white/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
        >
          {selectedGroupId 
            ? `${getGroupName(selectedGroupId)} - 提醒列表`
            : '全部提醒'
          }
        </motion.h2>
        <ShimmerButton
          onClick={() => setShowCreateForm(true)}
          disabled={groups.length === 0}
          className="px-6 py-3"
          background="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          shimmerColor="#ffffff"
        >
          <span className="text-white font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            创建提醒
          </span>
        </ShimmerButton>
      </motion.div>

      {groups.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </motion.div>
          <div className="text-gray-500 text-xl font-medium">请先创建一个分组</div>
        </motion.div>
      )}

      <AnimatePresence>
        {showCreateForm && groups.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl"
          >
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2"
            >
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </motion.div>
              创建新提醒
            </motion.h3>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">提醒标题</label>
                <motion.input
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  type="text"
                  placeholder="输入提醒标题"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">选择分组</label>
                <motion.select
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  value={formData.group_id}
                  onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </motion.select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">重复间隔</label>
                <motion.select
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  value={formData.repeat_interval}
                  onChange={(e) => setFormData({ ...formData, repeat_interval: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  {intervalOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </motion.select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">重复时长</label>
                <motion.select
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  value={formData.repeat_duration}
                  onChange={(e) => setFormData({ ...formData, repeat_duration: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </motion.select>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6"
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">选择颜色</label>
              <div className="flex flex-wrap gap-3 mb-6">
                {colorOptions.map((color, index) => (
                  <motion.button
                    key={color}
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1 * index, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-full border-3 transition-all duration-200 ${
                      formData.color === color ? 'border-gray-800 shadow-lg ring-2 ring-gray-300' : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-4 mt-6"
            >
              <ShimmerButton
                onClick={handleCreateReminder}
                className="flex-1 py-3"
                background="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                shimmerColor="#ffffff"
              >
                <span className="text-white font-medium">创建提醒</span>
              </ShimmerButton>
              <motion.button
                onClick={() => setShowCreateForm(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium"
              >
                取消
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredReminders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5V1H3v16h12zm0 0L9 11l6-6" />
            </svg>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-xl font-medium"
          >
            暂无提醒
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-sm mt-2"
          >
            点击上方按钮创建你的第一个提醒
          </motion.div>
        </motion.div>
      ) : (
        <AnimatedList
          items={filteredReminders.map((reminder) => ({
            id: reminder.id,
            content: (
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${
                  reminder.is_cancelled 
                    ? 'bg-gray-100/80 backdrop-blur-sm border border-gray-300/50' 
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-xl'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <motion.div
                        whileHover={{ scale: 1.3, rotate: 360 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-4 h-4 rounded-full mr-4 shadow-sm"
                        style={{ backgroundColor: reminder.color }}
                      />
                      <h3 className={`text-xl font-bold ${
                        reminder.is_cancelled ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}>
                        {reminder.title}
                      </h3>
                      {reminder.is_cancelled && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-3 px-3 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium"
                        >
                          已取消
                        </motion.span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <span className="font-medium">分组:</span> {getGroupName(reminder.group_id)}
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">重复间隔:</span> {formatTime(reminder.repeat_interval)}
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">重复时长:</span> {formatTime(reminder.repeat_duration)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="font-medium">创建时间:</span> {formatDate(reminder.created_at)}
                        </div>
                        {!reminder.is_cancelled && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5V1zm0 0L9 11l6-6" />
                            </svg>
                            <span className="font-medium">下次提醒:</span> {formatDate(reminder.next_trigger)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {!reminder.is_cancelled && (
                    <motion.button
                      onClick={() => onCancelReminder(reminder.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm font-medium shadow-lg"
                    >
                      取消提醒
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )
          }))}
          delay={200}
        />
      )}
    </div>
  );
};
