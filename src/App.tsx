import { useState, useEffect } from 'react';
import './App.css';
import { GroupList } from './components/GroupList';
import { ReminderList } from './components/ReminderList';
import { useReminderAPI } from './hooks/useReminderAPI';
import { ReminderGroup, Reminder, CreateReminderData } from './types';
import AnimatedGridPattern from './components/magicui/animated-grid-pattern';
import { motion } from 'motion/react';

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
      <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        <AnimatedGridPattern className="opacity-30" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className="text-xl text-gray-700 font-medium">加载中...</div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 overflow-hidden">
        <AnimatedGridPattern className="opacity-20" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center max-w-md mx-auto p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </motion.div>
          <div className="text-xl text-red-600 font-semibold mb-4">错误: {error}</div>
          <motion.button 
            onClick={loadData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg"
          >
            重试
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100">
      <AnimatedGridPattern 
        className="opacity-40 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]" 
        numSquares={20}
        maxOpacity={0.3}
        duration={3}
      />
      <motion.div 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10"
      >
        <GroupList
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={setSelectedGroupId}
          onCreateGroup={handleCreateGroup}
          onDeleteGroup={handleDeleteGroup}
        />
      </motion.div>
      <motion.div 
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="flex-1 relative z-10"
      >
        <ReminderList
          reminders={reminders}
          groups={groups}
          selectedGroupId={selectedGroupId}
          onCreateReminder={handleCreateReminder}
          onCancelReminder={handleCancelReminder}
        />
      </motion.div>
    </div>
  );
}

export default App;
