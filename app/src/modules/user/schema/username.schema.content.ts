import { t, type Dictionary } from 'intlayer'

const usernameSchemaContent = {
  key: 'username-schema',
  content: {
    min: t({
      en: 'Username must be at least 4 characters',
      uk: 'Ім’я користувача має містити щонайменше 4 символи',
      ru: 'Имя пользователя должно содержать не менее 4 символов',
    }),
    max: t({
      en: 'Username must be at most 25 characters',
      uk: 'Ім’я користувача має містити щонайбільше 25 символів',
      ru: 'Имя пользователя должно содержать не более 25 символов',
    }),
    pattern: t({
      en: 'Username can only contain letters, numbers, and underscores',
      uk: 'Ім’я користувача може містити лише літери, цифри та підкреслення',
      ru: 'Имя пользователя может содержать только буквы, цифры и подчёркивания',
    }),
  },
} satisfies Dictionary

export default usernameSchemaContent
