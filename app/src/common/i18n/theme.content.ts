import { t, type Dictionary } from 'intlayer'

const themeContent = {
  key: 'theme',
  content: {
    system: t({
      en: 'System',
      uk: 'Системна',
      ru: 'Системная',
    }),
    light: t({
      en: 'Light',
      uk: 'Світла',
      ru: 'Светлая',
    }),
    dark: t({
      en: 'Dark',
      uk: 'Темна',
      ru: 'Тёмная',
    }),
    red: t({
      en: 'Red',
      uk: 'Червоний',
      ru: 'Красный',
    }),
    orange: t({
      en: 'Orange',
      uk: 'Помаранчевий',
      ru: 'Оранжевый',
    }),
    yellow: t({
      en: 'Yellow',
      uk: 'Жовтий',
      ru: 'Жёлтый',
    }),
    green: t({
      en: 'Green',
      uk: 'Зелений',
      ru: 'Зелёный',
    }),
    teal: t({
      en: 'Teal',
      uk: 'Бірюзовий',
      ru: 'Бирюзовый',
    }),
    cyan: t({
      en: 'Cyan',
      uk: 'Блакитний',
      ru: 'Голубой',
    }),
    blue: t({
      en: 'Blue',
      uk: 'Синій',
      ru: 'Синий',
    }),
    indigo: t({
      en: 'Indigo',
      uk: 'Індиго',
      ru: 'Индиго',
    }),
    purple: t({
      en: 'Purple',
      uk: 'Фіолетовий',
      ru: 'Фиолетовый',
    }),
    pink: t({
      en: 'Pink',
      uk: 'Рожевий',
      ru: 'Розовый',
    }),
  },
} satisfies Dictionary

export default themeContent
