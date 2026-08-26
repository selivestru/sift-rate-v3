import { t, type Dictionary } from 'intlayer'

const deleteReviewDialogContent = {
  key: 'delete-review-dialog',
  content: {
    title: t({
      en: 'Delete review?',
      uk: 'Видалити рецензію?',
      ru: 'Удалить рецензию?',
    }),
    description: t({
      en: 'Your review for this title will be permanently removed.',
      uk: 'Вашу рецензію на цей матеріал буде назавжди видалено.',
      ru: 'Ваша рецензия на этот материал будет удалена навсегда.',
    }),
  },
} satisfies Dictionary

export default deleteReviewDialogContent
