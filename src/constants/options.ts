export const COLOR_OPTIONS = [
  '#6B9BD2', '#8FBC8F', '#DEB887', '#CD919E', 
  '#B19CD9', '#F4A7B9', '#87CEEB', '#F0E68C'
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
