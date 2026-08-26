import { t, type Dictionary } from 'intlayer'

const reviewRatingSelectContent = {
  key: 'review-rating-select',
  content: {
    allRatings: t({
      en: 'All ratings',
      uk: 'Усі оцінки',
      ru: 'Все оценки',
    }),
    filterByRating: t({
      en: 'Filter by rating',
      uk: 'Фільтрувати за оцінкою',
      ru: 'Фильтровать по оценке',
    }),
  },
} satisfies Dictionary

export default reviewRatingSelectContent
