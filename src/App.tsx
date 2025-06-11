import { useState, useEffect } from 'react';
import './App.css';
import { GroupList } from './components/GroupList';
import { ReminderList } from './components/ReminderList';
import { useReminderAPI } from './hooks/useReminderAPI';
import { ReminderGroup, Reminder, CreateReminderData } from './types';

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
      setGroups(prev => [...prev, newGroup]);
    } catch (err) {
      console.error('Failed to create group:', err);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await api.deleteGroup(groupId);
      setGroups(prev => prev.filter(g => g.id !== groupId));
      setReminders(prev => prev.filter(r => r.group_id !== groupId));
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null);
      }
    } catch (err) {
      console.error('Failed to delete group:', err);
    }
  };

  const handleCreateReminder = async (data: CreateReminderData) => {
    try {
      const newReminder = await api.createReminder(data);
      setReminders(prev => [...prev, newReminder]);
    } catch (err) {
      console.error('Failed to create reminder:', err);
    }
  };

  const handleCancelReminder = async (reminderId: string) => {
    try {
      await api.cancelReminder(reminderId);
      setReminders(prev => 
        prev.map(r => 
          r.id === reminderId 
            ? { ...r, is_cancelled: true }
            : r
        )
      );
    } catch (err) {
      console.error('Failed to cancel reminder:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">错误: {error}</div>
        <button 
          onClick={loadData}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      <GroupList
        groups={groups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
        onCreateGroup={handleCreateGroup}
        onDeleteGroup={handleDeleteGroup}
      />
      <ReminderList
        reminders={reminders}
        groups={groups}
        selectedGroupId={selectedGroupId}
        onCreateReminder={handleCreateReminder}
        onCancelReminder={handleCancelReminder}
      />
    </div>
  );
}

export default App;
