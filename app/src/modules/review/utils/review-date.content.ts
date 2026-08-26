import { insert, t, type Dictionary } from 'intlayer'

const reviewDateContent = {
  key: 'review-date',
  content: {
    anyDate: t({
      en: 'Any date',
      uk: 'Будь-яка дата',
      ru: 'Любая дата',
    }),
    filterByDate: t({
      en: 'Filter by date',
      uk: 'Фільтрувати за датою',
      ru: 'Фильтровать по дате',
    }),
    previousYear: t({
      en: 'Previous year',
      uk: 'Попередній рік',
      ru: 'Предыдущий год',
    }),
    showAllYear: insert(
      t({
        en: 'Show all of {{year}}',
        uk: 'Показати весь {{year}} рік',
        ru: 'Показать весь {{year}} год',
      }),
    ),
    nextYear: t({
      en: 'Next year',
      uk: 'Наступний рік',
      ru: 'Следующий год',
    }),
    months: {
      jan: t({ en: 'Jan', uk: 'Січ', ru: 'Янв' }),
      feb: t({ en: 'Feb', uk: 'Лют', ru: 'Фев' }),
      mar: t({ en: 'Mar', uk: 'Бер', ru: 'Мар' }),
      apr: t({ en: 'Apr', uk: 'Кві', ru: 'Апр' }),
      may: t({ en: 'May', uk: 'Тра', ru: 'Май' }),
      jun: t({ en: 'Jun', uk: 'Чер', ru: 'Июн' }),
      jul: t({ en: 'Jul', uk: 'Лип', ru: 'Июл' }),
      aug: t({ en: 'Aug', uk: 'Сер', ru: 'Авг' }),
      sep: t({ en: 'Sep', uk: 'Вер', ru: 'Сен' }),
      oct: t({ en: 'Oct', uk: 'Жов', ru: 'Окт' }),
      nov: t({ en: 'Nov', uk: 'Лис', ru: 'Ноя' }),
      dec: t({ en: 'Dec', uk: 'Гру', ru: 'Дек' }),
    },
  },
} satisfies Dictionary

export default reviewDateContent
