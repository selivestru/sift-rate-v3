export const formatRelativeDate = (iso: string) => {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const dayMs = 86_400_000
  const days = Math.floor(diffMs / dayMs)

  if (days <= 0) {
    return 'today'
  }
  if (days === 1) {
    return 'yesterday'
  }
  if (days < 30) {
    return `${days} days ago`
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
