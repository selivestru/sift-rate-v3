import { insert, t, type Dictionary } from 'intlayer'

const reviewCardContent = {
  key: 'review-card',
  content: {
    editReviewFor: insert(
      t({
        en: 'Edit review for {{title}}',
        uk: 'Редагувати рецензію на {{title}}',
        ru: 'Редактировать рецензию на {{title}}',
      }),
    ),
    deleteReviewFor: insert(
      t({
        en: 'Delete review for {{title}}',
        uk: 'Видалити рецензію на {{title}}',
        ru: 'Удалить рецензию на {{title}}',
      }),
    ),
    openTitle: insert(
      t({
        en: 'Open {{title}}',
        uk: 'Відкрити {{title}}',
        ru: 'Открыть {{title}}',
      }),
    ),
    perfect: t({
      en: 'Perfect',
      uk: 'Ідеально',
      ru: 'Идеально',
    }),
    noWrittenReview: t({
      en: 'No written review',
      uk: 'Без письмової рецензії',
      ru: 'Без письменной рецензии',
    }),
    seasons: t({
      en: 'Seasons',
      uk: 'Сезони',
      ru: 'Сезоны',
    }),
    seasonChip: insert(
      t({
        en: 'Season {{season}}',
        uk: 'Сезон {{season}}',
        ru: 'Сезон {{season}}',
      }),
    ),
    rateShow: t({
      en: 'Rate the show',
      uk: 'Оцінити серіал',
      ru: 'Оценить сериал',
    }),
  },
} satisfies Dictionary

export default reviewCardContent
