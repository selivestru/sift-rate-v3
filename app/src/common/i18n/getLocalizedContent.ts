import { getIntlayer } from 'intlayer'

import { getCurrentLocale } from './locale'

export const getLocalizedContent = ((...args: Parameters<typeof getIntlayer>) => {
  const [key, locale = getCurrentLocale(), ...rest] = args
  return getIntlayer(key, locale, ...rest)
}) as typeof getIntlayer
