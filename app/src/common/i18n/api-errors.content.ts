import { insert, t, type Dictionary } from 'intlayer'

const apiErrorsContent = {
  key: 'api-errors',
  content: {
    serverUnavailable: t({
      en: 'Server is unavailable. Please try again later.',
      uk: 'Сервер недоступний. Спробуйте ще раз пізніше.',
      ru: 'Сервер недоступен. Попробуйте ещё раз позже.',
    }),
    noInternet: t({
      en: 'No internet connection',
      uk: 'Немає з’єднання з інтернетом',
      ru: 'Нет соединения с интернетом',
    }),
    fallback: t({
      en: 'Something went wrong',
      uk: 'Щось пішло не так',
      ru: 'Что-то пошло не так',
    }),
    tooManyRequests: t({
      en: 'Too many requests, please try again later',
      uk: 'Забагато запитів. Спробуйте ще раз пізніше',
      ru: 'Слишком много запросов. Попробуйте ещё раз позже',
    }),
    forbidden: t({
      en: 'Your session expired. Please sign in again.',
      uk: 'Сеанс завершився. Увійдіть знову.',
      ru: 'Сеанс завершился. Войдите снова.',
    }),
    resourceNotFound: t({
      en: 'Resource not found',
      uk: 'Ресурс не знайдено',
      ru: 'Ресурс не найден',
    }),
    resourceAlreadyExists: t({
      en: 'Resource already exists',
      uk: 'Ресурс уже існує',
      ru: 'Ресурс уже существует',
    }),
    usernameTaken: t({
      en: 'This username is already taken',
      uk: 'Це ім’я користувача вже зайняте',
      ru: 'Это имя пользователя уже занято',
    }),
    invalidOAuthState: t({
      en: 'Invalid or expired OAuth state',
      uk: 'Недійсний або прострочений стан OAuth',
      ru: 'Недействительное или просроченное состояние OAuth',
    }),
    missingGoogleIdToken: t({
      en: 'Missing Google ID token',
      uk: 'Відсутній токен Google',
      ru: 'Отсутствует токен Google',
    }),
    googleEmailNotVerified: t({
      en: 'Google email is not verified',
      uk: 'Email Google не підтверджено',
      ru: 'Email Google не подтверждён',
    }),
    usernameMustBeString: t({
      en: 'Username must be a string',
      uk: 'Ім’я користувача має бути рядком',
      ru: 'Имя пользователя должно быть строкой',
    }),
    usernameMin: t({
      en: 'Username must be at least 4 characters',
      uk: 'Ім’я користувача має містити щонайменше 4 символи',
      ru: 'Имя пользователя должно содержать не менее 4 символов',
    }),
    usernameMax: t({
      en: 'Username must be at most 25 characters',
      uk: 'Ім’я користувача має містити щонайбільше 25 символів',
      ru: 'Имя пользователя должно содержать не более 25 символов',
    }),
    usernamePattern: t({
      en: 'Username may only contain letters, numbers, and underscores',
      uk: 'Ім’я користувача може містити лише літери, цифри та підкреслення',
      ru: 'Имя пользователя может содержать только буквы, цифры и подчёркивания',
    }),
    userNotFound: t({
      en: 'User not found',
      uk: 'Користувача не знайдено',
      ru: 'Пользователь не найден',
    }),
    fileRequired: t({
      en: 'File is required',
      uk: 'Потрібен файл',
      ru: 'Нужен файл',
    }),
    fileImageType: t({
      en: 'File must be a JPEG, PNG, or WebP image',
      uk: 'Файл має бути зображенням JPEG, PNG або WebP',
      ru: 'Файл должен быть изображением JPEG, PNG или WebP',
    }),
    invalidImage: t({
      en: 'Invalid image',
      uk: 'Недійсне зображення',
      ru: 'Недействительное изображение',
    }),
    reviewNotFound: t({
      en: 'Review not found',
      uk: 'Відгук не знайдено',
      ru: 'Отзыв не найден',
    }),
    noFieldsToUpdate: t({
      en: 'No fields to update',
      uk: 'Немає полів для оновлення',
      ru: 'Нет полей для обновления',
    }),
    mediaNotFound: t({
      en: 'Media not found',
      uk: 'Медіа не знайдено',
      ru: 'Медиа не найдено',
    }),
    mediaMustBeReviewed: t({
      en: 'Media must be reviewed before adding to a ranked list',
      uk: 'Перш ніж додати до рейтингового списку, поставте оцінку',
      ru: 'Прежде чем добавить в рейтинговый список, поставьте оценку',
    }),
    listNotFound: t({
      en: 'List not found',
      uk: 'Список не знайдено',
      ru: 'Список не найден',
    }),
    itemNotFound: t({
      en: 'Item not found',
      uk: 'Елемент не знайдено',
      ru: 'Элемент не найден',
    }),
    mediaAlreadyInList: t({
      en: 'Media is already in this list',
      uk: 'Цей запис уже є в списку',
      ru: 'Эта запись уже есть в списке',
    }),
    positionOutOfRange: insert(
      t({
        en: 'Position must be between 1 and {{max}}',
        uk: 'Позиція має бути від 1 до {{max}}',
        ru: 'Позиция должна быть от 1 до {{max}}',
      }),
    ),
    plannedItemExists: t({
      en: 'Planned item already exists',
      uk: 'Цей запис уже в запланованому',
      ru: 'Эта запись уже в запланированном',
    }),
    plannedItemNotFound: t({
      en: 'Planned item not found',
      uk: 'Запланований запис не знайдено',
      ru: 'Запланированная запись не найдена',
    }),
    fileTooLarge: t({
      en: 'File exceeds the 5MB limit',
      uk: 'Файл перевищує ліміт 5 МБ',
      ru: 'Файл превышает лимит 5 МБ',
    }),
    fileMustBeCsv: t({
      en: 'File must be a CSV export from IMDb',
      uk: 'Файл має бути CSV-експортом з IMDb',
      ru: 'Файл должен быть CSV-экспортом из IMDb',
    }),
    csvEmpty: t({
      en: 'CSV is empty',
      uk: 'CSV порожній',
      ru: 'CSV пуст',
    }),
    csvMissingColumns: insert(
      t({
        en: 'CSV is missing required columns: {{columns}}',
        uk: 'У CSV бракує обов’язкових колонок: {{columns}}',
        ru: 'В CSV не хватает обязательных колонок: {{columns}}',
      }),
    ),
    csvNoRatingRows: t({
      en: 'CSV has no rating rows',
      uk: 'У CSV немає рядків з оцінками',
      ru: 'В CSV нет строк с оценками',
    }),
    csvRowLimit: insert(
      t({
        en: 'CSV exceeds the limit of {{max}} rows',
        uk: 'CSV перевищує ліміт у {{max}} рядків',
        ru: 'CSV превышает лимит в {{max}} строк',
      }),
    ),
    invalidCsv: t({
      en: 'Invalid CSV',
      uk: 'Недійсний CSV',
      ru: 'Недействительный CSV',
    }),
    importAlreadyInProgress: t({
      en: 'An import is already in progress',
      uk: 'Імпорт уже виконується',
      ru: 'Импорт уже выполняется',
    }),
    nothingLeftToRetry: t({
      en: 'Nothing left to retry',
      uk: 'Немає чого повторювати',
      ru: 'Нечего повторять',
    }),
    importJobNotFound: t({
      en: 'Import job not found',
      uk: 'Завдання імпорту не знайдено',
      ru: 'Задание импорта не найдено',
    }),
    failedToEnqueueImport: t({
      en: 'Failed to enqueue import',
      uk: 'Не вдалося поставити імпорт у чергу',
      ru: 'Не удалось поставить импорт в очередь',
    }),
    importStalled: t({
      en: 'Import stalled and was marked failed',
      uk: 'Імпорт зупинився і позначений як невдалий',
      ru: 'Импорт остановился и помечен как неудачный',
    }),
    importFailed: t({
      en: 'Import failed',
      uk: 'Імпорт не вдався',
      ru: 'Импорт не удался',
    }),
    invalidRating: t({
      en: 'Invalid rating',
      uk: 'Недійсна оцінка',
      ru: 'Недействительная оценка',
    }),
    invalidImdbId: t({
      en: 'Invalid IMDb id',
      uk: 'Недійсний IMDb id',
      ru: 'Недействительный IMDb id',
    }),
    missingTitle: t({
      en: 'Missing title',
      uk: 'Немає назви',
      ru: 'Нет названия',
    }),
    titleNotFoundOnTmdb: t({
      en: 'Title not found on TMDB',
      uk: 'Назву не знайдено в TMDB',
      ru: 'Название не найдено в TMDB',
    }),
    unknownError: t({
      en: 'Unknown error',
      uk: 'Невідома помилка',
      ru: 'Неизвестная ошибка',
    }),
    invalidMediaType: t({
      en: 'Invalid media type',
      uk: 'Недійсний тип медіа',
      ru: 'Недействительный тип медиа',
    }),
    movieNotFound: t({
      en: 'Movie not found',
      uk: 'Фільм не знайдено',
      ru: 'Фильм не найден',
    }),
    tvShowNotFound: t({
      en: 'TV show not found',
      uk: 'Серіал не знайдено',
      ru: 'Сериал не найден',
    }),
    bookNotFound: t({
      en: 'Book not found',
      uk: 'Книгу не знайдено',
      ru: 'Книга не найдена',
    }),
    gameNotFound: t({
      en: 'Game not found',
      uk: 'Гру не знайдено',
      ru: 'Игра не найдена',
    }),
    pageMustBePositiveInteger: t({
      en: 'page must be a positive integer',
      uk: 'Номер сторінки має бути додатним цілим числом',
      ru: 'Номер страницы должен быть положительным целым числом',
    }),
    cannotRevokeCurrentSession: t({
      en: 'Cannot revoke the current session',
      uk: 'Не можна завершити поточний сеанс',
      ru: 'Нельзя завершить текущий сеанс',
    }),
    sessionNotFound: t({
      en: 'Session not found',
      uk: 'Сеанс не знайдено',
      ru: 'Сеанс не найден',
    }),
    failedToDestroySession: t({
      en: 'Failed to destroy session',
      uk: 'Не вдалося завершити сеанс',
      ru: 'Не удалось завершить сеанс',
    }),
    failedToSaveSession: t({
      en: 'Failed to save session, please try again',
      uk: 'Не вдалося зберегти сеанс. Спробуйте ще раз',
      ru: 'Не удалось сохранить сеанс. Попробуйте ещё раз',
    }),
    failedToPersistSession: t({
      en: 'Failed to persist session metadata',
      uk: 'Не вдалося зберегти дані сеансу',
      ru: 'Не удалось сохранить данные сеанса',
    }),
    failedToRevokeSession: t({
      en: 'Failed to revoke session',
      uk: 'Не вдалося завершити сеанс',
      ru: 'Не удалось завершить сеанс',
    }),
    failedToRevokeSessions: t({
      en: 'Failed to revoke sessions',
      uk: 'Не вдалося завершити сеанси',
      ru: 'Не удалось завершить сеансы',
    }),
    cursorMustBeUuid: t({
      en: 'Cursor must be a valid UUID',
      uk: 'Курсор має бути дійсним UUID',
      ru: 'Курсор должен быть действительным UUID',
    }),
  },
} satisfies Dictionary

export default apiErrorsContent
