export const formatDate = (date: string) => {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
  }).format(dateObj)
}
