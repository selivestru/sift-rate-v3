import { insert, t, type Dictionary } from 'intlayer'

const reviewDatePickerContent = {
  key: 'review-date-picker',
  content: {
    dateLabel: t({
      en: 'Date',
      uk: 'Дата',
      ru: 'Дата',
    }),
    today: t({
      en: 'Today',
      uk: 'Сьогодні',
      ru: 'Сегодня',
    }),
    chooseDate: t({
      en: 'Choose date',
      uk: 'Оберіть дату',
      ru: 'Выберите дату',
    }),
    previousMonth: t({
      en: 'Previous month',
      uk: 'Попередній місяць',
      ru: 'Предыдущий месяц',
    }),
    nextMonth: t({
      en: 'Next month',
      uk: 'Наступний місяць',
      ru: 'Следующий месяц',
    }),
    monthYear: insert(
      t({
        en: '{{month}} {{year}}',
        uk: '{{month}} {{year}}',
        ru: '{{month}} {{year}}',
      }),
    ),
    pickDay: insert(
      t({
        en: 'Pick {{date}}',
        uk: 'Обрати {{date}}',
        ru: 'Выбрать {{date}}',
      }),
    ),
  },
} satisfies Dictionary

export default reviewDatePickerContent
