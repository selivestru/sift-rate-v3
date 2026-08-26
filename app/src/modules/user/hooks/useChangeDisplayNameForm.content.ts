import { t, type Dictionary } from 'intlayer'

const changeDisplayNameFormContent = {
  key: 'user-change-display-name-form',
  content: {
    same: t({
      en: 'Display name cannot be the same',
      uk: 'Відображуване ім’я не може бути таким самим',
      ru: 'Отображаемое имя не может быть таким же',
    }),
    updated: t({
      en: 'Display name updated',
      uk: 'Відображуване ім’я оновлено',
      ru: 'Отображаемое имя обновлено',
    }),
  },
} satisfies Dictionary

export default changeDisplayNameFormContent
