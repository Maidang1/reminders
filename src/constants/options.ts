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


export const PRESETS_TIME_OPTIONS = [
  { value: '00:00', label: '00:00' },
  { value: '01:00', label: '01:00' },
  { value: '02:00', label: '02:00' },
  { value: '03:00', label: '03:00' },
  { value: '04:00', label: '04:00' },
  { value: '05:00', label: '05:00' },
  { value: '06:00', label: '06:00' },
  { value: '07:00', label: '07:00' },
  { value: '08:00', label: '08:00' },
  { value: '09:00', label: '09:00' },
  { value: '10:00', label: '10:00' },
  { value: '11:00', label: '11:00' },
  { value: '12:00', label: '12:00' },
  { value: '13:00', label: '13:00' },
  { value: '14:00', label: '14:00' },
  { value: '15:00', label: '15:00' },
  { value: '16:00', label: '16:00' },
  { value: '17:00', label: '17:00' },
  { value: '18:00', label: '18:00' },
  { value: '19:00', label: '19:00' },
  { value: '20:00', label: '20:00' },
  { value: '21:00', label: '21:00' },
  { value: '22:00', label: '22:00' },
  { value: '23:00', label: '23:00' },
] as const;