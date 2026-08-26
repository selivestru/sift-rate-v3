import { insert, t, type Dictionary } from 'intlayer'

const imdbImportJobStatusContent = {
  key: 'imdb-import-job-status',
  content: {
    queued: t({
      en: 'Queued',
      uk: 'У черзі',
      ru: 'В очереди',
    }),
    processing: t({
      en: 'Processing',
      uk: 'Обробляється',
      ru: 'Обрабатывается',
    }),
    completed: t({
      en: 'Completed',
      uk: 'Завершено',
      ru: 'Завершено',
    }),
    failed: t({
      en: 'Failed',
      uk: 'Помилка',
      ru: 'Ошибка',
    }),
    queuedDescription: t({
      en: 'Your file is uploaded and waiting to be processed. This usually starts within a few seconds.',
      uk: 'Файл завантажено, він очікує на обробку. Зазвичай вона починається за кілька секунд.',
      ru: 'Файл загружен и ожидает обработки. Обычно она начинается через несколько секунд.',
    }),
    processingDescription: t({
      en: 'Matching each row against the catalog and adding ratings to your library. You can leave this page — the import continues in the background.',
      uk: 'Кожен рядок зіставляється з каталогом, а оцінки додаються до бібліотеки. Ви можете залишити цю сторінку — імпорт продовжиться у фоновому режимі.',
      ru: 'Каждая строка сопоставляется с каталогом, а оценки добавляются в библиотеку. Вы можете покинуть страницу — импорт продолжится в фоновом режиме.',
    }),
    completedDescription: t({
      en: 'The import has finished. Anything that could not be matched is listed below.',
      uk: 'Імпорт завершено. Нижче наведено все, що не вдалося зіставити.',
      ru: 'Импорт завершён. Ниже перечислено всё, что не удалось сопоставить.',
    }),
    failedDescription: t({
      en: 'The import stopped before finishing. Rows already processed are kept — retrying only picks up what is left.',
      uk: 'Імпорт зупинився до завершення. Уже оброблені рядки збережено — повторна спроба обробить лише те, що залишилося.',
      ru: 'Импорт остановился до завершения. Уже обработанные строки сохранены — повторная попытка обработает только оставшееся.',
    }),
    started: insert(
      t({
        en: 'Started {{time}}',
        uk: 'Почато {{time}}',
        ru: 'Начато {{time}}',
      }),
    ),
    finished: insert(
      t({
        en: 'Finished {{time}}',
        uk: 'Завершено {{time}}',
        ru: 'Завершено {{time}}',
      }),
    ),
    importAnotherFile: t({
      en: 'Import another file',
      uk: 'Імпортувати інший файл',
      ru: 'Импортировать другой файл',
    }),
    progress: t({
      en: 'Progress',
      uk: 'Прогрес',
      ru: 'Прогресс',
    }),
    processed: t({
      en: 'Processed',
      uk: 'Оброблено',
      ru: 'Обработано',
    }),
    processedCount: insert(
      t({
        en: '{{processed}} of {{total}} rows',
        uk: '{{processed}} із {{total}} рядків',
        ru: '{{processed}} из {{total}} строк',
      }),
    ),
    processedCountWithPercent: insert(
      t({
        en: '{{processed}} of {{total}} rows · {{progress}}%',
        uk: '{{processed}} із {{total}} рядків · {{progress}}%',
        ru: '{{processed}} из {{total}} строк · {{progress}}%',
      }),
    ),
    progressAriaLabel: t({
      en: 'Import progress',
      uk: 'Прогрес імпорту',
      ru: 'Прогресс импорта',
    }),
    imported: t({
      en: 'Imported',
      uk: 'Імпортовано',
      ru: 'Импортировано',
    }),
    alreadyInLibrary: t({
      en: 'Already in library',
      uk: 'Вже в бібліотеці',
      ru: 'Уже в библиотеке',
    }),
    unsupportedType: t({
      en: 'Unsupported type',
      uk: 'Непідтримуваний тип',
      ru: 'Неподдерживаемый тип',
    }),
    notFound: t({
      en: 'Not found',
      uk: 'Не знайдено',
      ru: 'Не найдено',
    }),
    invalidRows: t({
      en: 'Invalid rows',
      uk: 'Некоректні рядки',
      ru: 'Некорректные строки',
    }),
    errors: t({
      en: 'Errors',
      uk: 'Помилки',
      ru: 'Ошибки',
    }),
    whyStopped: t({
      en: 'Why it stopped',
      uk: 'Чому зупинилося',
      ru: 'Почему остановилось',
    }),
    retryDescription: t({
      en: 'Retry only re-processes unmatched rows — not found, errors, and skipped types.',
      uk: 'Повторна спроба обробляє лише неспівставлені рядки — ненайдені, з помилками та пропущених типів.',
      ru: 'Повторная попытка обрабатывает только несопоставленные строки — ненайденные, с ошибками и пропущенных типов.',
    }),
    retryUnfinishedRows: t({
      en: 'Retry unfinished rows',
      uk: 'Повторити незавершені рядки',
      ru: 'Повторить незавершённые строки',
    }),
  },
} satisfies Dictionary

export default imdbImportJobStatusContent
