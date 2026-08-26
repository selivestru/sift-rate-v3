import { t, type Dictionary } from 'intlayer'

const reviewListContent = {
  key: 'review-list',
  content: {
    couldNotLoadReviews: t({
      en: 'Couldn’t load reviews.',
      uk: 'Не вдалося завантажити рецензії.',
      ru: 'Не удалось загрузить рецензии.',
    }),
  },
} satisfies Dictionary

export default reviewListContent
