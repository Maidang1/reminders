export const COLOR_OPTIONS = [
  '#6B9BD2', '#8FBC8F', '#DEB887', '#CD919E', 
  '#B19CD9', '#F4A7B9', '#87CEEB', '#F0E68C'
] as const;

export const INTERVAL_OPTIONS = [
  { value: 60, label: '1分钟' },
  { value: 300, label: '5分钟' },
  { value: 900, label: '15分钟' },
  { value: 1800, label: '30分钟' },
  { value: 3600, label: '1小时' },
  { value: 7200, label: '2小时' },
  { value: 86400, label: '1天' },
] as const;

export const DURATION_OPTIONS = [
  { value: 3600, label: '1小时' },
  { value: 86400, label: '1天' },
  { value: 604800, label: '1周' },
  { value: 2592000, label: '1个月' },
  { value: 31536000, label: '1年' },
  { value: 0, label: '永久' },
] as const;

export const DEFAULT_FORM_DATA = {
  title: '',
  color: COLOR_OPTIONS[0],
  repeat_interval: 300,
  repeat_duration: 86400,
} as const;
