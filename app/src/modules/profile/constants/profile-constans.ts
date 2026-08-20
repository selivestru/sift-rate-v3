export const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const calendarTheme = {
  light: [
    'var(--muted)',
    'color-mix(in oklab, var(--primary) 24%, var(--muted))',
    'color-mix(in oklab, var(--primary) 46%, var(--muted))',
    'color-mix(in oklab, var(--primary) 70%, var(--muted))',
    'var(--primary)',
  ],
  dark: [
    'var(--muted)',
    'color-mix(in oklab, var(--primary) 28%, var(--muted))',
    'color-mix(in oklab, var(--primary) 50%, var(--muted))',
    'color-mix(in oklab, var(--primary) 74%, var(--muted))',
    'var(--primary)',
  ],
}
