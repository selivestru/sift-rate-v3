import { insert, plural, t, type Dictionary } from 'intlayer'

const imdbImportHistoryContent = {
  key: 'imdb-import-history',
  content: {
    title: t({
      en: 'Import history',
      uk: 'Історія імпортів',
      ru: 'История импортов',
    }),
    description: t({
      en: 'Every IMDb import you have run, newest first. Select one to see its full report above.',
      uk: 'Усі виконані вами імпорти IMDb, спочатку найновіші. Виберіть один, щоб переглянути повний звіт вище.',
      ru: 'Все выполненные вами импорты IMDb, сначала новые. Выберите один, чтобы увидеть полный отчёт выше.',
    }),
    loadError: t({
      en: 'Could not load your import history.',
      uk: 'Не вдалося завантажити історію імпортів.',
      ru: 'Не удалось загрузить историю импортов.',
    }),
    noImports: t({
      en: 'No imports yet. Upload your ratings export to get started.',
      uk: 'Імпортів ще немає. Завантажте експорт оцінок, щоб почати.',
      ru: 'Импортов пока нет. Загрузите экспорт оценок, чтобы начать.',
    }),
    imported: insert(
      t({
        en: '{{count}} imported',
        uk: 'Імпортовано: {{count}}',
        ru: 'Импортировано: {{count}}',
      }),
    ),
    alreadyInLibrary: insert(
      t({
        en: '{{count}} already in library',
        uk: '{{count}} вже в бібліотеці',
        ru: '{{count}} уже в библиотеке',
      }),
    ),
    unsupported: insert(
      t({
        en: '{{count}} unsupported',
        uk: '{{count}} непідтримуваних',
        ru: '{{count}} неподдерживаемых',
      }),
    ),
    notFound: insert(
      t({
        en: '{{count}} not found',
        uk: '{{count}} не знайдено',
        ru: '{{count}} не найдено',
      }),
    ),
    invalid: insert(
      t({
        en: '{{count}} invalid',
        uk: '{{count}} некоректних',
        ru: '{{count}} некорректных',
      }),
    ),
    errors: insert(
      t({
        en: '{{count}} errors',
        uk: '{{count}} помилок',
        ru: '{{count}} ошибок',
      }),
    ),
    rows: plural({
      one: t({
        en: '{{count}} row',
        uk: '{{count}} рядок',
        ru: '{{count}} строка',
      }),
      few: t({
        en: '{{count}} rows',
        uk: '{{count}} рядки',
        ru: '{{count}} строки',
      }),
      many: t({
        en: '{{count}} rows',
        uk: '{{count}} рядків',
        ru: '{{count}} строк',
      }),
      other: t({
        en: '{{count}} rows',
        uk: '{{count}} рядків',
        ru: '{{count}} строк',
      }),
    }),
    noRows: t({
      en: 'No rows',
      uk: 'Немає рядків',
      ru: 'Нет строк',
    }),
    processedOfTotal: insert(
      t({
        en: '{{processed}} of {{total}}',
        uk: '{{processed}} із {{total}}',
        ru: '{{processed}} из {{total}}',
      }),
    ),
    loadingMoreImports: t({
      en: 'Loading more imports',
      uk: 'Завантаження додаткових імпортів',
      ru: 'Загрузка дополнительных импортов',
    }),
  },
} satisfies Dictionary

export default imdbImportHistoryContent
