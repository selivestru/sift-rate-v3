import { t, type Dictionary } from 'intlayer'

const rateSchemaContent = {
  key: 'rate-schema',
  content: {
    rating: t({
      en: 'Choose a score from 1 to 10',
      uk: 'Оберіть оцінку від 1 до 10',
      ru: 'Выберите оценку от 1 до 10',
    }),
  },
} satisfies Dictionary

export default rateSchemaContent
