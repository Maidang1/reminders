import { useState, useEffect } from 'react';
import { useReminderAPI } from './hooks/useReminderAPI';
import { Reminder, CreateReminderData } from './types';
import { ReminderList } from './components/ReminderList';
// import { AddReminderPanel } from './components/AddReminderPanel';
import './App.css';
import { AddReminderPanel } from './components/AddReminderPanel';

function App() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);

  const api = useReminderAPI();

  const loadData = async () => {
    try {
      setLoading(true);
      const remindersData = await api.getReminders();
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
      <div className='app-container loading-state'>
        <div className='loading-content'>
          <div className='loading-spinner'></div>
          <div className='loading-text'>加载中...</div>
          <div className='loading-subtext'>正在获取您的提醒数据</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='app-container error-state'>
        <div className='error-content'>
          <div className='error-icon'>
            <svg
              className='error-svg'
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
          <div className='error-title'>出现错误</div>
          <div className='error-message'>{error}</div>
          <button
            onClick={loadData}
            className='retry-button'
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='app-container'>
      {/* 主要内容区域 */}
      <div className='main-content'>
        <ReminderList
          reminders={reminders}
          onCancelReminder={handleCancelReminder}
        />
      </div>

      {/* 右下角添加按钮 */}
      <button
        onClick={() => setShowAddPanel(true)}
        className='add-button'
        aria-label="添加提醒"
      >
        <svg className='add-icon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
        </svg>
      </button>

      {/* 添加提醒面板 */}
      <AddReminderPanel
        isOpen={showAddPanel}
        onClose={() => setShowAddPanel(false)}
        onCreateReminder={handleCreateReminder}
      />
    </div>
  );
}

export default App;
