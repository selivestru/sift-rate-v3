import { t, type Dictionary } from 'intlayer'

const changeUsernameFormContent = {
  key: 'change-username-form',
  content: {
    title: t({
      en: 'Username',
      uk: 'Ім’я користувача',
      ru: 'Имя пользователя',
    }),
    description: t({
      en: 'Your public handle on SiftRate. Letters, numbers, and underscores only.',
      uk: 'Ваше публічне ім’я у SiftRate. Лише літери, цифри та підкреслення.',
      ru: 'Ваше публичное имя в SiftRate. Только буквы, цифры и подчёркивания.',
    }),
    save: t({
      en: 'Save username',
      uk: 'Зберегти ім’я користувача',
      ru: 'Сохранить имя пользователя',
    }),
    currentLabel: t({
      en: 'Current username',
      uk: 'Поточне ім’я користувача',
      ru: 'Текущее имя пользователя',
    }),
    newLabel: t({
      en: 'New username',
      uk: 'Нове ім’я користувача',
      ru: 'Новое имя пользователя',
    }),
    newPlaceholder: t({
      en: 'New username',
      uk: 'Нове ім’я користувача',
      ru: 'Новое имя пользователя',
    }),
  },
} satisfies Dictionary

export default changeUsernameFormContent
