import { t, type Dictionary } from 'intlayer'

const reviewListFiltersContent = {
  key: 'review-list-filters',
  content: {
    searchYourReviews: t({
      en: 'Search your reviews',
      uk: 'Шукати ваші рецензії',
      ru: 'Искать ваши рецензии',
    }),
  },
} satisfies Dictionary

export default reviewListFiltersContent
