import { t, type Dictionary } from 'intlayer'

const changeDisplayNameFormContent = {
  key: 'change-display-name-form',
  content: {
    title: t({
      en: 'Display name',
      uk: 'Відображуване ім’я',
      ru: 'Отображаемое имя',
    }),
    description: t({
      en: 'Your name shown across your personal archive. Between 2 and 50 characters.',
      uk: 'Ваше ім’я, що відображається у вашому особистому архіві. Від 2 до 50 символів.',
      ru: 'Ваше имя, отображаемое в личном архиве. От 2 до 50 символов.',
    }),
    save: t({
      en: 'Save display name',
      uk: 'Зберегти відображуване ім’я',
      ru: 'Сохранить отображаемое имя',
    }),
    currentLabel: t({
      en: 'Current display name',
      uk: 'Поточне відображуване ім’я',
      ru: 'Текущее отображаемое имя',
    }),
    newLabel: t({
      en: 'New display name',
      uk: 'Нове відображуване ім’я',
      ru: 'Новое отображаемое имя',
    }),
    newPlaceholder: t({
      en: 'New display name',
      uk: 'Нове відображуване ім’я',
      ru: 'Новое отображаемое имя',
    }),
  },
} satisfies Dictionary

export default changeDisplayNameFormContent
