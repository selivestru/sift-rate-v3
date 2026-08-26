import { Locales, type IntlayerConfig } from 'intlayer'

const config: IntlayerConfig = {
  internationalization: {
    locales: [Locales.ENGLISH, Locales.UKRAINIAN, Locales.RUSSIAN],
    defaultLocale: Locales.ENGLISH,
    requiredLocales: [Locales.ENGLISH, Locales.UKRAINIAN, Locales.RUSSIAN],
    strictMode: 'strict',
  },
  routing: {
    mode: 'no-prefix',
    enableProxy: false,
    storage: {
      type: 'localStorage',
      name: 'locale',
    },
  },
  content: {
    contentDir: ['src'],
    formatCommand: 'bun x oxfmt "{{file}}"',
  },
}

export default config
