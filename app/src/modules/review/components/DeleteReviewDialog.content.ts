import { insert, t, type Dictionary } from 'intlayer'

const deleteReviewDialogContent = {
  key: 'delete-review-dialog',
  content: {
    deleteTitle: t({
      en: 'Delete rating?',
      uk: 'Видалити оцінку?',
      ru: 'Удалить оценку?',
    }),
    deleteTitleDescription: t({
      en: 'Your rating will be permanently removed.',
      uk: 'Вашу оцінку буде назавжди видалено.',
      ru: 'Ваша оценка будет удалена навсегда.',
    }),
    deleteShowTitle: t({
      en: 'Delete show rating?',
      uk: 'Видалити оцінку серіалу?',
      ru: 'Удалить оценку сериала?',
    }),
    deleteShowDescription: t({
      en: 'Your rating for the show will be permanently removed.',
      uk: 'Вашу оцінку серіалу буде назавжди видалено.',
      ru: 'Ваша оценка сериала будет удалена навсегда.',
    }),
    seasonLabel: insert(
      t({
        en: 'Season {{season}}',
        uk: 'Сезон {{season}}',
        ru: 'Сезон {{season}}',
      }),
    ),
    deleteSeasonTitle: insert(
      t({
        en: 'Delete rating for {{season}}?',
        uk: 'Видалити оцінку для {{season}}?',
        ru: 'Удалить оценку для {{season}}?',
      }),
    ),
    deleteSeasonDescription: insert(
      t({
        en: 'Your rating for {{season}} will be permanently removed.',
        uk: 'Вашу оцінку для {{season}} буде назавжди видалено.',
        ru: 'Ваша оценка для {{season}} будет удалена навсегда.',
      }),
    ),
  },
} satisfies Dictionary

export default deleteReviewDialogContent
