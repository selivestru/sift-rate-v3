import { t, type Dictionary } from 'intlayer'

const displayNameSchemaContent = {
  key: 'display-name-schema',
  content: {
    required: t({
      en: 'Display name is required',
      uk: 'Потрібне відображуване ім’я',
      ru: 'Нужно отображаемое имя',
    }),
    min: t({
      en: 'Display name must be at least 2 characters',
      uk: 'Відображуване ім’я має містити щонайменше 2 символи',
      ru: 'Отображаемое имя должно содержать не менее 2 символов',
    }),
    max: t({
      en: 'Display name must be at most 50 characters',
      uk: 'Відображуване ім’я має містити щонайбільше 50 символів',
      ru: 'Отображаемое имя должно содержать не более 50 символов',
    }),
  },
} satisfies Dictionary

export default displayNameSchemaContent
