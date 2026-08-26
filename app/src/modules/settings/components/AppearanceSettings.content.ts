import { t, type Dictionary } from 'intlayer'

const appearanceSettingsContent = {
  key: 'appearance-settings',
  content: {
    languageTitle: t({
      en: 'Language',
      uk: 'Мова',
      ru: 'Язык',
    }),
    languageDescription: t({
      en: 'Choose the language of your archive.',
      uk: 'Оберіть мову свого архіву.',
      ru: 'Выберите язык своего архива.',
    }),
    languageGroupLabel: t({
      en: 'Language',
      uk: 'Мова',
      ru: 'Язык',
    }),
    selectedSuffix: t({
      en: ', selected',
      uk: ', вибрано',
      ru: ', выбрано',
    }),
    pageDescription: t({
      en: 'Choose light or dark mode and a brand accent for your archive.',
      uk: 'Оберіть світлу чи темну тему та акцентний колір архіву.',
      ru: 'Выберите светлую или тёмную тему и акцентный цвет архива.',
    }),
    themeTitle: t({
      en: 'Theme',
      uk: 'Тема',
      ru: 'Тема',
    }),
    themeDescription: t({
      en: 'Match your system preference or force light or dark.',
      uk: 'Підлаштуйтеся під систему або зафіксуйте світлу чи темну тему.',
      ru: 'Следуйте системе или зафиксируйте светлую или тёмную тему.',
    }),
    accentTitle: t({
      en: 'Accent color',
      uk: 'Акцентний колір',
      ru: 'Акцентный цвет',
    }),
    accentDescription: t({
      en: 'Recolors primary actions, focus rings, and soft accent surfaces.',
      uk: 'Перефарбовує основні дії, кільця фокусу та м’які акценти.',
      ru: 'Перекрашивает основные действия, кольца фокуса и мягкие акценты.',
    }),
  },
} satisfies Dictionary

export default appearanceSettingsContent
