import { insert, t, type Dictionary } from 'intlayer'

const formattersContent = {
  key: 'formatters',
  content: {
    today: t({
      en: 'today',
      uk: 'сьогодні',
      ru: 'сегодня',
    }),
    yesterday: t({
      en: 'yesterday',
      uk: 'вчора',
      ru: 'вчера',
    }),
    daysAgo: insert(
      t({
        en: '{{count}} days ago',
        uk: '{{count}} днів тому',
        ru: '{{count}} дней назад',
      }),
    ),
    minutes: insert(
      t({
        en: '{{count}}m',
        uk: '{{count}}хв',
        ru: '{{count}}м',
      }),
    ),
    hours: insert(
      t({
        en: '{{count}}h',
        uk: '{{count}}год',
        ru: '{{count}}ч',
      }),
    ),
    hoursMinutes: insert(
      t({
        en: '{{hours}}h {{minutes}}m',
        uk: '{{hours}}год {{minutes}}хв',
        ru: '{{hours}}ч {{minutes}}м',
      }),
    ),
    daysHoursMinutes: insert(
      t({
        en: '{{days}}d {{hours}}h {{minutes}}m',
        uk: '{{days}}д {{hours}}год {{minutes}}хв',
        ru: '{{days}}д {{hours}}ч {{minutes}}м',
      }),
    ),
    hoursPaddedMinutes: insert(
      t({
        en: '{{hours}}h {{minutes}}m',
        uk: '{{hours}}год {{minutes}}хв',
        ru: '{{hours}}ч {{minutes}}м',
      }),
    ),
    minutesSeconds: insert(
      t({
        en: '{{minutes}}m {{seconds}}s',
        uk: '{{minutes}}хв {{seconds}}с',
        ru: '{{minutes}}м {{seconds}}с',
      }),
    ),
    seconds: insert(
      t({
        en: '{{count}}s',
        uk: '{{count}}с',
        ru: '{{count}}с',
      }),
    ),
  },
} satisfies Dictionary

export default formattersContent
