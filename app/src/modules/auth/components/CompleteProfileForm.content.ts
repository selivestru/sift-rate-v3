import { t, type Dictionary } from 'intlayer'

const completeProfileFormContent = {
  key: 'complete-profile-form',
  content: {
    title: t({
      en: 'Complete your profile',
      uk: 'Заповніть свій профіль',
      ru: 'Заполните свой профиль',
    }),
    description: t({
      en: 'Pick a unique username.',
      uk: 'Оберіть унікальне ім’я користувача.',
      ru: 'Выберите уникальное имя пользователя.',
    }),
    usernameLabel: t({
      en: 'Username',
      uk: 'Ім’я користувача',
      ru: 'Имя пользователя',
    }),
    usernamePlaceholder: t({
      en: 'Choose a username',
      uk: 'Оберіть ім’я користувача',
      ru: 'Выберите имя пользователя',
    }),
    usernameHint: t({
      en: '4–25 characters. Letters, numbers, and underscores only.',
      uk: '4–25 символів. Лише літери, цифри та символи підкреслення.',
      ru: '4–25 символов. Только буквы, цифры и символы подчёркивания.',
    }),
    saving: t({
      en: 'Saving…',
      uk: 'Збереження…',
      ru: 'Сохранение…',
    }),
    profileCompleted: t({
      en: 'Profile completed',
      uk: 'Профіль заповнено',
      ru: 'Профиль заполнен',
    }),
  },
} satisfies Dictionary

export default completeProfileFormContent
