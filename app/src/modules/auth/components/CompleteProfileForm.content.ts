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
      en: 'Choose how your name appears and pick a unique username.',
      uk: 'Оберіть, як відображатиметься ваше ім’я, і придумайте унікальне ім’я користувача.',
      ru: 'Выберите отображаемое имя и придумайте уникальное имя пользователя.',
    }),
    displayNameLabel: t({
      en: 'Display name',
      uk: 'Відображуване ім’я',
      ru: 'Отображаемое имя',
    }),
    displayNamePlaceholder: t({
      en: 'Your name',
      uk: 'Ваше ім’я',
      ru: 'Ваше имя',
    }),
    displayNameHint: t({
      en: 'Use 2 to 50 characters.',
      uk: 'Використайте від 2 до 50 символів.',
      ru: 'Используйте от 2 до 50 символов.',
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
