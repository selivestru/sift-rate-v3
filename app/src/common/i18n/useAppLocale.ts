import { useLocale } from 'react-intlayer'

import { setCurrentLocale, type AppLocale } from './locale'

export const useAppLocale = () => {
  const { locale, setLocale } = useLocale()

  const changeLocale = (next: AppLocale) => {
    setLocale(next)
    setCurrentLocale(next)
  }

  return {
    locale,
    setLocale: changeLocale,
  }
}
