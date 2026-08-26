import { insert, plural, t, type Dictionary } from 'intlayer'

const discoverSearchUiContent = {
  key: 'discover-search-ui',
  content: {
    noResults: t({ en: 'No results', uk: 'Немає результатів', ru: 'Нет результатов' }),
    resultCount: plural({
      one: t({ en: '{{count}} result', uk: '{{count}} результат', ru: '{{count}} результат' }),
      other: t({
        en: '{{count}} results',
        uk: '{{count}} результатів',
        ru: '{{count}} результатов',
      }),
    }),
    searchPrompt: insert(
      t({
        en: 'Search {{media}}',
        uk: 'Шукати: {{media}}',
        ru: 'Искать: {{media}}',
      }),
    ),
    idleDescription: t({
      en: 'Type at least 2 characters and press Search to look through the catalog.',
      uk: 'Введіть щонайменше 2 символи та натисніть «Пошук», щоб переглянути каталог.',
      ru: 'Введите не менее 2 символов и нажмите «Поиск», чтобы просмотреть каталог.',
    }),
    emptyTitle: insert(
      t({
        en: 'No results for “{{query}}”',
        uk: 'Немає результатів для «{{query}}»',
        ru: 'Нет результатов для «{{query}}»',
      }),
    ),
    emptyDescription: t({
      en: 'Try a different spelling, a shorter title, or another keyword.',
      uk: 'Спробуйте інше написання, коротшу назву або інше ключове слово.',
      ru: 'Попробуйте другое написание, более короткое название или другое ключевое слово.',
    }),
    searchError: t({
      en: 'Something went wrong while searching. Try again.',
      uk: 'Під час пошуку щось пішло не так. Спробуйте ще раз.',
      ru: 'При поиске что-то пошло не так. Попробуйте ещё раз.',
    }),
  },
} satisfies Dictionary

export default discoverSearchUiContent
