import { insert, t, type Dictionary } from 'intlayer'

const importsSettingsContent = {
  key: 'imports-settings',
  content: {
    pageDescription: t({
      en: 'Bring ratings from other services into your archive.',
      uk: 'Переносьте оцінки з інших сервісів до свого архіву.',
      ru: 'Переносите оценки из других сервисов в свой архив.',
    }),
    imdbDescription: t({
      en: 'Import ratings from your IMDb ratings export (CSV).',
      uk: 'Імпортуйте оцінки з експорту оцінок IMDb (CSV).',
      ru: 'Импортируйте оценки из экспорта оценок IMDb (CSV).',
    }),
    importFrom: insert(
      t({
        en: 'Import from {{service}}',
        uk: 'Імпорт із {{service}}',
        ru: 'Импорт из {{service}}',
      }),
    ),
  },
} satisfies Dictionary

export default importsSettingsContent
