import { insert, t, type Dictionary } from 'intlayer'

const imdbImportPageContent = {
  key: 'imdb-import-page',
  content: {
    backToImports: t({
      en: 'All imports',
      uk: 'Усі імпорти',
      ru: 'Все импорты',
    }),
    title: t({
      en: 'IMDb ratings',
      uk: 'Оцінки IMDb',
      ru: 'Оценки IMDb',
    }),
    description: t({
      en: 'Import the ratings.csv export from your IMDb account. Each row is matched by IMDb ID and added to your library as a rating.',
      uk: 'Імпортуйте файл ratings.csv зі свого облікового запису IMDb. Кожен рядок зіставляється за IMDb ID і додається до бібліотеки як оцінка.',
      ru: 'Импортируйте файл ratings.csv из своего аккаунта IMDb. Каждая строка сопоставляется по IMDb ID и добавляется в библиотеку как оценка.',
    }),
    loadErrorDescription: t({
      en: 'Something went wrong while loading your import status.',
      uk: 'Під час завантаження статусу імпорту щось пішло не так.',
      ru: 'При загрузке статуса импорта что-то пошло не так.',
    }),
    pastImportDescription: t({
      en: 'You are viewing a past import. Another import is active right now.',
      uk: 'Ви переглядаєте минулий імпорт. Зараз активний інший імпорт.',
      ru: 'Вы просматриваете прошлый импорт. Сейчас активен другой импорт.',
    }),
    viewActiveImport: t({
      en: 'View active import',
      uk: 'Переглянути активний імпорт',
      ru: 'Посмотреть активный импорт',
    }),
    uploadTitle: t({
      en: 'Upload your ratings export',
      uk: 'Завантажте експорт оцінок',
      ru: 'Загрузите экспорт оценок',
    }),
    uploadDescription: t({
      en: 'On IMDb, open Your Ratings and choose Export to download ratings.csv.',
      uk: 'На IMDb відкрийте Your Ratings і виберіть Export, щоб завантажити ratings.csv.',
      ru: 'На IMDb откройте Your Ratings и выберите Export, чтобы скачать ratings.csv.',
    }),
    whatGetsImported: t({
      en: 'What gets imported',
      uk: 'Що імпортується',
      ru: 'Что импортируется',
    }),
    whatGetsImportedDescription: t({
      en: 'A few things worth knowing before you start.',
      uk: 'Кілька речей, про які варто знати перед початком.',
      ru: 'Несколько вещей, которые стоит знать перед началом.',
    }),
    requiredColumns: t({
      en: 'Required columns: Const, Your Rating, Date Rated, Title, Title Type — all present in the standard IMDb export',
      uk: 'Обов’язкові стовпці: Const, Your Rating, Date Rated, Title, Title Type — усі є у стандартному експорті IMDb',
      ru: 'Обязательные столбцы: Const, Your Rating, Date Rated, Title, Title Type — все есть в стандартном экспорте IMDb',
    }),
    rowAndFileLimit: insert(
      t({
        en: 'Up to {{rows}} rows per file, {{size}} MB maximum',
        uk: 'До {{rows}} рядків у файлі, максимум {{size}} МБ',
        ru: 'До {{rows}} строк в файле, максимум {{size}} МБ',
      }),
    ),
    supportedTypes: t({
      en: 'Movies (including shorts) and TV series are imported; episodes, video games, and podcasts are skipped',
      uk: 'Імпортуються фільми (зокрема короткометражні) та серіали; епізоди, відеоігри й подкасти пропускаються',
      ru: 'Импортируются фильмы (включая короткометражные) и сериалы; эпизоды, видеоигры и подкасты пропускаются',
    }),
    existingRatings: t({
      en: 'Ratings you already have in your library are left untouched',
      uk: 'Оцінки, які вже є у вашій бібліотеці, не змінюються',
      ru: 'Оценки, которые уже есть в вашей библиотеке, не изменяются',
    }),
    oneImportAtATime: t({
      en: 'Only one import can run at a time',
      uk: 'Одночасно може виконуватися лише один імпорт',
      ru: 'Одновременно может выполняться только один импорт',
    }),
  },
} satisfies Dictionary

export default imdbImportPageContent
