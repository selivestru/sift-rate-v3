export const formatTime = ({
  days,
  hours,
  minutes,
  seconds,
}: {
  days: number
  hours: number
  minutes: number
  seconds: number
}) => {
  if (days > 0) {
    return `${days}d ${hours}h ${minutes.toString().padStart(2, '0')}m`
  }

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
  }

  return `${seconds}s`
}
