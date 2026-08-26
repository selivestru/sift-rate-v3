import { t, type Dictionary } from 'intlayer'

const imdbImportRowsContent = {
  key: 'imdb-import-rows',
  content: {
    rowResults: t({
      en: 'Row results',
      uk: 'Результати рядків',
      ru: 'Результаты строк',
    }),
    updatingRows: t({
      en: 'Updating rows',
      uk: 'Оновлення рядків',
      ru: 'Обновление строк',
    }),
    imported: t({
      en: 'Imported',
      uk: 'Імпортовано',
      ru: 'Импортировано',
    }),
    alreadyExisted: t({
      en: 'Already existed',
      uk: 'Вже існувало',
      ru: 'Уже существовало',
    }),
    unsupported: t({
      en: 'Unsupported',
      uk: 'Непідтримувані',
      ru: 'Неподдерживаемые',
    }),
    notFound: t({
      en: 'Not found',
      uk: 'Не знайдено',
      ru: 'Не найдено',
    }),
    invalid: t({
      en: 'Invalid',
      uk: 'Некоректні',
      ru: 'Некорректные',
    }),
    errors: t({
      en: 'Errors',
      uk: 'Помилки',
      ru: 'Ошибки',
    }),
    queued: t({
      en: 'Queued',
      uk: 'У черзі',
      ru: 'В очереди',
    }),
    error: t({
      en: 'Error',
      uk: 'Помилка',
      ru: 'Ошибка',
    }),
    noRows: t({
      en: 'No rows in this import yet.',
      uk: 'У цьому імпорті ще немає рядків.',
      ru: 'В этом импорте пока нет строк.',
    }),
    noRowsWithStatus: t({
      en: 'No rows with this status in this import.',
      uk: 'У цьому імпорті немає рядків із таким статусом.',
      ru: 'В этом импорте нет строк с таким статусом.',
    }),
    loadError: t({
      en: 'Could not load the rows for this import.',
      uk: 'Не вдалося завантажити рядки цього імпорту.',
      ru: 'Не удалось загрузить строки этого импорта.',
    }),
    loadingMoreRows: t({
      en: 'Loading more rows',
      uk: 'Завантаження додаткових рядків',
      ru: 'Загрузка дополнительных строк',
    }),
    rated: t({
      en: 'Rated',
      uk: 'Оцінено',
      ru: 'Оценено',
    }),
  },
} satisfies Dictionary

export default imdbImportRowsContent
