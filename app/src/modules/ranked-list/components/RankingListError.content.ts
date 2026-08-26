import { t, type Dictionary } from 'intlayer'

const rankingListErrorContent = {
  key: 'ranking-list-error',
  content: {
    title: t({
      en: 'Couldn’t load your ranked lists.',
      uk: 'Не вдалося завантажити ваші рейтинги.',
      ru: 'Не удалось загрузить ваши рейтинги.',
    }),
    description: t({
      en: 'Couldn’t load your rankings. Try again later.',
      uk: 'Не вдалося завантажити ваші рейтинги. Спробуйте ще раз пізніше.',
      ru: 'Не удалось загрузить ваши рейтинги. Попробуйте ещё раз позже.',
    }),
  },
} satisfies Dictionary

export default rankingListErrorContent
