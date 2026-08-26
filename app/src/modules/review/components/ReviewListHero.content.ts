import { plural, t, type Dictionary } from 'intlayer'

const reviewListHeroContent = {
  key: 'review-list-hero',
  content: {
    description: t({
      en: 'Ratings and notes that map what you watch, read, play, and hear.',
      uk: 'Оцінки й нотатки про те, що ви дивитеся, читаєте, граєте та слухаєте.',
      ru: 'Оценки и заметки о том, что вы смотрите, читаете, во что играете и что слушаете.',
    }),
    loadingReviewCount: t({
      en: 'Loading review count',
      uk: 'Завантаження кількості рецензій',
      ru: 'Загрузка количества рецензий',
    }),
    reviewCount: plural({
      one: t({
        en: '{{count}} review logged in your archive',
        uk: '{{count}} рецензія у вашому архіві',
        ru: '{{count}} рецензия в вашем архиве',
      }),
      few: t({
        en: '{{count}} reviews logged in your archive',
        uk: '{{count}} рецензії у вашому архіві',
        ru: '{{count}} рецензии в вашем архиве',
      }),
      many: t({
        en: '{{count}} reviews logged in your archive',
        uk: '{{count}} рецензій у вашому архіві',
        ru: '{{count}} рецензий в вашем архиве',
      }),
      other: t({
        en: '{{count}} reviews logged in your archive',
        uk: '{{count}} рецензії у вашому архіві',
        ru: '{{count}} рецензии в вашем архиве',
      }),
    }),
    logged: t({
      en: 'logged',
      uk: 'додано',
      ru: 'добавлено',
    }),
  },
} satisfies Dictionary

export default reviewListHeroContent
