import { insert, t, type Dictionary } from 'intlayer'

const deleteRankedListDialogContent = {
  key: 'delete-ranked-list-dialog',
  content: {
    title: t({
      en: 'Delete list?',
      uk: 'Видалити список?',
      ru: 'Удалить список?',
    }),
    description: insert(
      t({
        en: '“{{title}}” and every ranked item in it will be removed. This cannot be undone.',
        uk: '«{{title}}» і всі елементи в ньому буде видалено. Цю дію не можна скасувати.',
        ru: '«{{title}}» и все элементы в нём будут удалены. Это действие нельзя отменить.',
      }),
    ),
    deleteList: t({
      en: 'Delete list',
      uk: 'Видалити список',
      ru: 'Удалить список',
    }),
  },
} satisfies Dictionary

export default deleteRankedListDialogContent
