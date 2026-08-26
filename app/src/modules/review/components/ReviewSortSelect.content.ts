import { t, type Dictionary } from 'intlayer'

const reviewSortSelectContent = {
  key: 'review-sort-select',
  content: {
    newest: t({
      en: 'New ratings',
      uk: 'Нові оцінки',
      ru: 'Новые оценки',
    }),
    oldest: t({
      en: 'Old ratings',
      uk: 'Старі оцінки',
      ru: 'Старые оценки',
    }),
    sortReviews: t({
      en: 'Sort reviews',
      uk: 'Сортувати рецензії',
      ru: 'Сортировать рецензии',
    }),
  },
} satisfies Dictionary

export default reviewSortSelectContent
