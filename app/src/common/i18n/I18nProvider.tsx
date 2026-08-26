import { getHTMLTextDir } from 'intlayer'
import { useEffect } from 'react'
import { IntlayerProviderContent } from 'react-intlayer'

import { useAppLocale } from './useAppLocale'

const I18nDocumentLang = ({ children }: React.PropsWithChildren) => {
  const { locale } = useAppLocale()

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = getHTMLTextDir(locale)
  }, [locale])

  return children
}

export const I18nProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <IntlayerProviderContent>
      <I18nDocumentLang>{children}</I18nDocumentLang>
    </IntlayerProviderContent>
  )
}
