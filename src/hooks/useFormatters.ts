import { useMemo } from 'react';

export const useFormatters = () => {
  const formatTime = useMemo(() => (seconds: number) => {
    if (seconds === 0) return '永久';
    if (seconds < 60) return `${seconds}秒`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时`;
    return `${Math.floor(seconds / 86400)}天`;
  }, []);

  const formatDate = useMemo(() => (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('zh-CN');
  }, []);

  const formatDateTime = useMemo(() => (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const reminderDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = reminderDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const timeStr = date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    if (diffDays === 0) {
      return `今天 ${timeStr}`;
    } else if (diffDays === 1) {
      return `明天 ${timeStr}`;
    } else if (diffDays === -1) {
      return `昨天 ${timeStr}`;
    } else if (diffDays > 1 && diffDays <= 7) {
      const weekday = date.toLocaleDateString('zh-CN', { weekday: 'long' });
      return `${weekday} ${timeStr}`;
    } else {
      return date.toLocaleDateString('zh-CN', { 
        month: 'short', 
        day: 'numeric' 
      }) + ` ${timeStr}`;
    }
  }, []);

  return { formatTime, formatDate, formatDateTime };
};
