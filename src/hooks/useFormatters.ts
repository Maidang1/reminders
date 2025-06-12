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

  return { formatTime, formatDate };
};
