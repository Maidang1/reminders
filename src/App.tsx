import { useState, useEffect } from 'react';
import { useReminderAPI } from './hooks/useReminderAPI';
import { ReminderGroup, Reminder, CreateReminderData } from './types';
import { GroupList } from './components/GroupList';
import { ReminderList } from './components/ReminderList';
import './App.css';

function App() {
  const [groups, setGroups] = useState<ReminderGroup[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = useReminderAPI();

  const loadData = async () => {
    try {
      setLoading(true);
      const [groupsData, remindersData] = await Promise.all([
        api.getGroups(),
        api.getReminders(),
      ]);
      setGroups(groupsData);
      setReminders(remindersData);
      setError(null);
    } catch (err) {
      setError(err as string);
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateGroup = async (name: string, color: string) => {
    try {
      const newGroup = await api.createGroup({ name, color });
      setGroups((prev) => [...prev, newGroup]);
    } catch (err) {
      console.error('Failed to create group:', err);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await api.deleteGroup(groupId);
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
      setReminders((prev) => prev.filter((r) => r.group_id !== groupId));
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null);
      }
    } catch (err) {
      console.error('Failed to delete group:', err);
    }
  };

  const handleCreateReminder = async (data: CreateReminderData) => {
    try {
      console.log('Created reminder:', data);

      const newReminder = await api.createReminder(data);
      console.log('Created reminder:', newReminder, data);
      setReminders((prev) => [...prev, newReminder]);
    } catch (err) {
      console.error('Failed to create reminder:', err);
    }
  };

  const handleCancelReminder = async (reminderId: string) => {
    try {
      await api.cancelReminder(reminderId);
      setReminders((prev) =>
        prev.map((r) =>
          r.id === reminderId ? { ...r, is_cancelled: true } : r
        )
      );
    } catch (err) {
      console.error('Failed to cancel reminder:', err);
    }
  };

  if (loading) {
    return (
      <div className='apple-app-container items-center justify-center'>
        <div className='apple-form-container text-center max-w-sm mx-auto'>
          <div className='w-12 h-12 border-3 border-slate-400 border-t-transparent rounded-full mx-auto mb-4'></div>
          <div className='text-lg font-semibold text-white mb-2'>加载中...</div>
          <div className='text-sm text-gray-400'>正在获取您的提醒数据</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='apple-app-container items-center justify-center'>
        <div className='apple-form-container text-center max-w-md mx-auto'>
          <div className='w-16 h-16 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-8 h-8 text-red-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <div className='text-lg font-semibold text-red-400 mb-2'>
            出现错误
          </div>
          <div className='text-sm text-gray-400 mb-6'>{error}</div>
          <button
            onClick={loadData}
            className='apple-button apple-button-primary'
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='apple-app-container'>
      {/* 左侧分组列表 */}
      <div className='w-80 apple-sidebar apple-scrollbar overflow-y-auto'>
        <GroupList
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={setSelectedGroupId}
          onCreateGroup={handleCreateGroup}
          onDeleteGroup={handleDeleteGroup}
          reminders={reminders}
          onCancelReminder={handleCancelReminder}
        />
      </div>

      {/* 右侧提醒创建区域 */}
      <div className='flex-1 apple-main-content apple-scrollbar overflow-y-auto'>
        <ReminderList
          reminders={reminders}
          groups={groups}
          selectedGroupId={selectedGroupId}
          onCreateReminder={handleCreateReminder}
          onCancelReminder={handleCancelReminder}
        />
      </div>
    </div>
  );
}

export default App;
