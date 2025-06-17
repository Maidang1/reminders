export const COLOR_OPTIONS = [
  '#007AFF', '#34C759', '#FF9500', '#FF3B30', 
  '#AF52DE', '#FF2D55', '#5AC8FA', '#FFCC00'
] as const;

export const COMMON_CRON_EXPRESSIONS = [
  { value: '0 9 * * 1-5', label: '工作日 9:00' },
  { value: '0 18 * * 1-5', label: '工作日 18:00' },
  { value: '0 10 * * 6,0', label: '周末 10:00' },
  { value: '0 0 * * *', label: '每天 0:00' },
  { value: '0 12 * * *', label: '每天 12:00' },
  { value: '0 0 1 * *', label: '每月 1 号' },
  { value: '0 0 * * 1', label: '每周一' },
] as const;

export const DEFAULT_FORM_DATA = {
  title: '',
  color: COLOR_OPTIONS[0],
  cron_expression: '',
  description: '',
} as const;
