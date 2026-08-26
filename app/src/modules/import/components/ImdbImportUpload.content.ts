import { insert, t, type Dictionary } from 'intlayer'

const imdbImportUploadContent = {
  key: 'imdb-import-upload',
  content: {
    onlyCsv: t({
      en: 'Only CSV files are accepted. Export your ratings from IMDb as a CSV file.',
      uk: 'Приймаються лише файли CSV. Експортуйте свої оцінки з IMDb як файл CSV.',
      ru: 'Принимаются только файлы CSV. Экспортируйте оценки из IMDb в формате CSV.',
    }),
    fileTooLarge: insert(
      t({
        en: 'This file is {{size}}. The maximum size is {{maxSize}} MB.',
        uk: 'Розмір цього файлу — {{size}}. Максимальний розмір — {{maxSize}} МБ.',
        ru: 'Размер этого файла — {{size}}. Максимальный размер — {{maxSize}} МБ.',
      }),
    ),
    fileSizeKb: insert(
      t({
        en: '{{size}} KB',
        uk: '{{size}} КБ',
        ru: '{{size}} КБ',
      }),
    ),
    fileSizeMb: insert(
      t({
        en: '{{size}} MB',
        uk: '{{size}} МБ',
        ru: '{{size}} МБ',
      }),
    ),
    dropzoneLabel: t({
      en: 'IMDb ratings CSV dropzone',
      uk: 'Область завантаження CSV з оцінками IMDb',
      ru: 'Область загрузки CSV с оценками IMDb',
    }),
    dropTitle: t({
      en: 'Drop your ratings CSV here',
      uk: 'Перетягніть сюди CSV з оцінками',
      ru: 'Перетащите сюда CSV с оценками',
    }),
    dropDescription: insert(
      t({
        en: 'CSV up to {{size}} MB, at most {{rows}} rows',
        uk: 'CSV до {{size}} МБ, не більше {{rows}} рядків',
        ru: 'CSV до {{size}} МБ, не более {{rows}} строк',
      }),
    ),
    chooseFile: t({
      en: 'Choose file',
      uk: 'Вибрати файл',
      ru: 'Выбрать файл',
    }),
    chooseFileAria: t({
      en: 'Choose IMDb ratings CSV file',
      uk: 'Вибрати CSV-файл з оцінками IMDb',
      ru: 'Выбрать CSV-файл с оценками IMDb',
    }),
    removeSelectedFile: t({
      en: 'Remove selected file',
      uk: 'Видалити вибраний файл',
      ru: 'Удалить выбранный файл',
    }),
    startImport: t({
      en: 'Start import',
      uk: 'Почати імпорт',
      ru: 'Начать импорт',
    }),
  },
} satisfies Dictionary

export default imdbImportUploadContent
