import type { z } from 'zod'

export function getStorageItem<T>(key: string, schema: z.ZodType<T>, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return schema.parse(JSON.parse(raw))
  } catch {
    return fallback
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {}
}
