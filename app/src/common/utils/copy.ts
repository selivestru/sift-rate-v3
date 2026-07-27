export const copy = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    console.error('Failed to copy text to clipboard')
  }
}
