import { insert, t, type Dictionary } from 'intlayer'

const userActivityContent = {
  key: 'user-activity',
  content: {
    title: t({
      en: 'User Activity',
      uk: 'Активність користувача',
      ru: 'Активность пользователя',
    }),
    unableToLoadActivity: t({
      en: 'Unable to load activity',
      uk: 'Не вдалося завантажити активність',
      ru: 'Не удалось загрузить активность',
    }),
    activityLoadDescription: t({
      en: "We couldn't load this user's activity. Please try again later.",
      uk: 'Не вдалося завантажити активність цього користувача. Спробуйте ще раз пізніше.',
      ru: 'Не удалось загрузить активность этого пользователя. Попробуйте ещё раз позже.',
    }),
    selectYear: t({
      en: 'Select year',
      uk: 'Вибрати рік',
      ru: 'Выбрать год',
    }),
    totalCount: insert(
      t({
        en: '{{count}} reviews in {{year}}',
        uk: '{{count}} рецензій у {{year}}',
        ru: '{{count}} рецензий за {{year}}',
      }),
    ),
    less: t({
      en: 'Less',
      uk: 'Менше',
      ru: 'Меньше',
    }),
    more: t({
      en: 'More',
      uk: 'Більше',
      ru: 'Больше',
    }),
    activityTooltipSingular: insert(
      t({
        en: '{{count}} review on {{date}}',
        uk: '{{count}} рецензія за {{date}}',
        ru: '{{count}} рецензия за {{date}}',
      }),
    ),
    activityTooltipPlural: insert(
      t({
        en: '{{count}} reviews on {{date}}',
        uk: '{{count}} рецензій за {{date}}',
        ru: '{{count}} рецензий за {{date}}',
      }),
    ),
    noActivityYet: t({
      en: 'No activity yet',
      uk: 'Активності ще немає',
      ru: 'Активности пока нет',
    }),
  },
} satisfies Dictionary

export default userActivityContent
