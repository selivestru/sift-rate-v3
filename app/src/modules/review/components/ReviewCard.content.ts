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
  },
} satisfies Dictionary

export default reviewCardContent
