import { t, type Dictionary } from 'intlayer'

const changeUsernameFormContent = {
  key: 'user-change-username-form',
  content: {
    same: t({
      en: 'Username cannot be the same',
      uk: 'Ім’я користувача не може бути таким самим',
      ru: 'Имя пользователя не может быть таким же',
    }),
    updated: t({
      en: 'Username updated',
      uk: 'Ім’я користувача оновлено',
      ru: 'Имя пользователя обновлено',
    }),
  },
} satisfies Dictionary

export default changeUsernameFormContent
