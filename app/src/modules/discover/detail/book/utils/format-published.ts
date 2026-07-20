import { formatDate } from '~/common/utils/formatDate'

const formatMonthYear = (year: number, monthIndex: number) => {
  const date = new Date(Date.UTC(year, monthIndex, 1))
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export const formatPublished = (publishedDate: string, year = '') => {
  if (!publishedDate) return year || null

  if (/^\d{4}-\d{2}-\d{2}$/.test(publishedDate)) {
    return formatDate(publishedDate)
  }

  if (/^\d{4}-\d{2}$/.test(publishedDate)) {
    const [y, m] = publishedDate.split('-')
    return formatMonthYear(Number(y), Number(m) - 1)
  }

  if (/^\d{4}$/.test(publishedDate)) {
    return publishedDate
  }

  return year || publishedDate
}
