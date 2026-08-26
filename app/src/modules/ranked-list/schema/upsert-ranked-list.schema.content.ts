import { t, type Dictionary } from 'intlayer'

const upsertRankedListSchemaContent = {
  key: 'upsert-ranked-list-schema',
  content: {
    required: t({
      en: 'Title is required',
      uk: 'Потрібна назва',
      ru: 'Нужно название',
    }),
    max: t({
      en: 'Title must be at most 128 characters',
      uk: 'Назва має містити щонайбільше 128 символів',
      ru: 'Название должно содержать не более 128 символов',
    }),
  },
} satisfies Dictionary

export default upsertRankedListSchemaContent
