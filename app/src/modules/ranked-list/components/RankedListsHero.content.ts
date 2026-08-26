import { plural, t, type Dictionary } from 'intlayer'

const rankedListsHeroContent = {
  key: 'ranked-lists-hero',
  content: {
    description: t({
      en: 'Ordered boards of favorites. Podium first, full ranks inside each list.',
      uk: 'Упорядковані списки улюбленого. Спочатку п’єдестал, повний рейтинг — усередині.',
      ru: 'Упорядоченные списки любимого. Сначала пьедестал, полный рейтинг — внутри.',
    }),
    newList: t({
      en: 'New list',
      uk: 'Новий список',
      ru: 'Новый список',
    }),
    loadingListCount: t({
      en: 'Loading list count',
      uk: 'Завантаження кількості списків',
      ru: 'Загрузка количества списков',
    }),
    listCount: plural({
      one: t({
        en: '{{count}} list ordered',
        uk: '{{count}} список упорядковано',
        ru: '{{count}} список упорядочен',
      }),
      few: t({
        en: '{{count}} lists ordered',
        uk: '{{count}} списки упорядковано',
        ru: '{{count}} списка упорядочено',
      }),
      many: t({
        en: '{{count}} lists ordered',
        uk: '{{count}} списків упорядковано',
        ru: '{{count}} списков упорядочено',
      }),
      other: t({
        en: '{{count}} lists ordered',
        uk: '{{count}} списку упорядковано',
        ru: '{{count}} списка упорядочено',
      }),
    }),
    listsOrdered: t({
      en: 'lists ordered',
      uk: 'списків упорядковано',
      ru: 'списков упорядочено',
    }),
  },
} satisfies Dictionary

export default rankedListsHeroContent
