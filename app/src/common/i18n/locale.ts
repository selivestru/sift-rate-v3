import { Locales } from 'intlayer'
import { z } from 'zod'

import { getStorageItem } from '../utils/storage'

export const LOCALES = [Locales.ENGLISH, Locales.UKRAINIAN, Locales.RUSSIAN] as const

export type AppLocale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'en'

export const LOCALE_NATIVE_NAMES: Record<AppLocale, string> = {
  [Locales.ENGLISH]: 'English',
  [Locales.UKRAINIAN]: 'Українська',
  [Locales.RUSSIAN]: 'Русский',
}

let currentLocale: AppLocale = getStorageItem('locale', z.enum(LOCALES), DEFAULT_LOCALE, false)

export const getCurrentLocale = (): AppLocale => currentLocale

export const setCurrentLocale = (locale: AppLocale) => {
  currentLocale = locale
}
