import { t, type Dictionary } from 'intlayer'

const userFeedContent = {
  key: 'user-feed',
  content: {
    title: t({
      en: 'Feed',
      uk: 'Стрічка',
      ru: 'Лента',
    }),
    unableToLoadFeed: t({
      en: 'Unable to load feed',
      uk: 'Не вдалося завантажити стрічку',
      ru: 'Не удалось загрузить ленту',
    }),
    feedLoadDescription: t({
      en: "We couldn't load this user's reviews. Please try again later.",
      uk: 'Не вдалося завантажити рецензії цього користувача. Спробуйте ще раз пізніше.',
      ru: 'Не удалось загрузить рецензии этого пользователя. Попробуйте ещё раз позже.',
    }),
    noReviewsDescription: t({
      en: 'Nothing rated or reviewed so far.',
      uk: 'Поки що нічого не оцінено й не прорецензовано.',
      ru: 'Пока ничего не оценено и не прорецензировано.',
    }),
  },
} satisfies Dictionary

export default userFeedContent
