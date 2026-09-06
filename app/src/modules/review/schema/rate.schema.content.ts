import { t, type Dictionary } from 'intlayer'

const rateSchemaContent = {
  key: 'rate-schema',
  content: {
    rating: t({
      en: 'Choose a score from 1 to 10',
      uk: 'Оберіть оцінку від 1 до 10',
      ru: 'Выберите оценку от 1 до 10',
    }),
    dateInvalid: t({
      en: 'Choose a valid date',
      uk: 'Оберіть коректну дату',
      ru: 'Выберите корректную дату',
    }),
    dateFuture: t({
      en: 'Date cannot be in the future',
      uk: 'Дата не може бути в майбутньому',
      ru: 'Дата не может быть в будущем',
    }),
    dateTooOld: t({
      en: 'Date is too far in the past',
      uk: 'Дата занадто давня',
      ru: 'Дата слишком давняя',
    }),
  },
} satisfies Dictionary

export default rateSchemaContent
