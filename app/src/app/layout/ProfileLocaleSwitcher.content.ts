import { t, type Dictionary } from 'intlayer'

const profileLocaleSwitcherContent = {
  key: 'profile-locale-switcher',
  content: {
    languageLabel: t({
      en: 'Language',
      uk: 'Мова',
      ru: 'Язык',
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
  },
} satisfies Dictionary

export default profileLocaleSwitcherContent
