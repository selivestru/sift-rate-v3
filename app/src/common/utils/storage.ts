import { z } from 'zod'

export const getStorageItem = <T>(
  key: string,
  schema: z.ZodType<T>,
  fallback: T,
  withParse: boolean = true,
): T => {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return schema.parse(withParse ? JSON.parse(raw) : raw)
  } catch {
    return fallback
  }
}

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch {}
}
