import { t, type Dictionary } from 'intlayer'

const upsertRankedListDialogContent = {
  key: 'upsert-ranked-list-dialog',
  content: {
    editTitle: t({ en: 'Edit list', uk: 'Редагувати список', ru: 'Редактировать список' }),
    newTitle: t({ en: 'New ranked list', uk: 'Новий рейтинг', ru: 'Новый рейтинг' }),
    editDescription: t({
      en: 'Update the title and who can see this ranking.',
      uk: 'Оновіть назву та налаштуйте, хто може бачити цей рейтинг.',
      ru: 'Обновите название и настройте, кто может видеть этот рейтинг.',
    }),
    newDescription: t({
      en: 'Name a ranking and choose how visible it is.',
      uk: 'Назвіть рейтинг і виберіть, хто його бачитиме.',
      ru: 'Назовите рейтинг и выберите, кто его увидит.',
    }),
    titleLabel: t({ en: 'Title', uk: 'Назва', ru: 'Название' }),
    titlePlaceholder: t({
      en: 'Top films of the decade',
      uk: 'Найкращі фільми десятиліття',
      ru: 'Лучшие фильмы десятилетия',
    }),
    saveChanges: t({ en: 'Save changes', uk: 'Зберегти зміни', ru: 'Сохранить изменения' }),
    createList: t({ en: 'Create list', uk: 'Створити список', ru: 'Создать список' }),
  },
} satisfies Dictionary

export default upsertRankedListDialogContent
