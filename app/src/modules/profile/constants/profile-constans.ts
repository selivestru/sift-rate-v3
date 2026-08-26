import { useIntlayer } from 'react-intlayer'

export const useProfileCalendarLabels = () => {
  const content = useIntlayer('profile-constants')

  return {
    MONTH_LABELS: content.monthLabels.map((label) => label.value),
    WEEKDAY_LABELS: content.weekdayLabels.map((label) => label.value),
  }
}

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
