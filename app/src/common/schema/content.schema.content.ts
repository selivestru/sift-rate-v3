import { insert, t, type Dictionary } from 'intlayer'

const contentSchemaContent = {
  key: 'content-schema',
  content: {
    required: t({
      en: 'Content is required',
      uk: 'Потрібен текст',
      ru: 'Нужен текст',
    }),
    max: insert(
      t({
        en: 'Content must be at most {{count}} characters',
        uk: 'Текст має містити щонайбільше {{count}} символів',
        ru: 'Текст должен содержать не более {{count}} символов',
      }),
    ),
  },
} satisfies Dictionary

export default contentSchemaContent
