export const getFirstLetter = (str?: string | null) => {
  if (!str) return '?'
  return str?.charAt(0).toUpperCase()
}
