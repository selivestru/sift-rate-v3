import { t, type Dictionary } from 'intlayer'

const deleteAccountDialogContent = {
  key: 'delete-account-dialog',
  content: {
    title: t({
      en: 'Delete your account?',
      uk: 'Видалити обліковий запис?',
      ru: 'Удалить аккаунт?',
    }),
    description: t({
      en: 'This permanently removes your profile, reviews, lists, and media archive. This cannot be undone.',
      uk: 'Це назавжди видалить ваш профіль, рецензії, списки та медіаархів. Цю дію неможливо скасувати.',
      ru: 'Это навсегда удалит ваш профиль, рецензии, списки и медиаархив. Это действие нельзя отменить.',
    }),
    deletedToast: t({
      en: 'Your account has been deleted',
      uk: 'Ваш обліковий запис видалено',
      ru: 'Ваш аккаунт удалён',
    }),
  },
} satisfies Dictionary

export default deleteAccountDialogContent
