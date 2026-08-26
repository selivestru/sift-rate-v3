import { plural, t, type Dictionary } from 'intlayer'

const rankedListDetailDialogContent = {
  key: 'ranked-list-detail-dialog',
  content: {
    rankedCount: plural({
      one: t({
        en: '{{count}} ranked item',
        uk: '{{count}} елемент у рейтингу',
        ru: '{{count}} элемент в рейтинге',
      }),
      few: t({
        en: '{{count}} ranked items',
        uk: '{{count}} елементи у рейтингу',
        ru: '{{count}} элемента в рейтинге',
      }),
      many: t({
        en: '{{count}} ranked items',
        uk: '{{count}} елементів у рейтингу',
        ru: '{{count}} элементов в рейтинге',
      }),
      other: t({
        en: '{{count}} ranked items',
        uk: '{{count}} елементи у рейтингу',
        ru: '{{count}} элемента в рейтинге',
      }),
    }),
    add: t({ en: 'Add', uk: 'Додати', ru: 'Добавить' }),
    emptyPodium: t({ en: 'Empty podium', uk: 'П’єдестал порожній', ru: 'Пьедестал пуст' }),
    emptyDescription: t({
      en: 'Add rated media to start building this ranking.',
      uk: 'Додайте оцінені медіа, щоб почати створювати цей рейтинг.',
      ru: 'Добавьте оценённые медиа, чтобы начать создавать этот рейтинг.',
    }),
    addMedia: t({ en: 'Add media', uk: 'Додати медіа', ru: 'Добавить медиа' }),
  },
} satisfies Dictionary

export default rankedListDetailDialogContent
