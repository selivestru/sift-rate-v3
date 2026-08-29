import { t, type Dictionary } from 'intlayer'

const settingsNavContent = {
  key: 'settings-nav',
  content: {
    sections: t({
      en: 'Settings sections',
      uk: 'Розділи налаштувань',
      ru: 'Разделы настроек',
    }),
    account: t({
      en: 'Account',
      uk: 'Обліковий запис',
      ru: 'Аккаунт',
    }),
    accountDescription: t({
      en: 'Avatar and username',
      uk: 'Аватар та ім’я користувача',
      ru: 'Аватар и имя пользователя',
    }),
    imports: t({
      en: 'Imports',
      uk: 'Імпорт',
      ru: 'Импорт',
    }),
    importsDescription: t({
      en: 'Import ratings from other services',
      uk: 'Імпортуйте оцінки з інших сервісів',
      ru: 'Импортируйте оценки из других сервисов',
    }),
    dangerZone: t({
      en: 'Danger zone',
      uk: 'Небезпечна зона',
      ru: 'Опасная зона',
    }),
    dangerZoneDescription: t({
      en: 'Delete your account',
      uk: 'Видалити обліковий запис',
      ru: 'Удалить аккаунт',
    }),
  },
} satisfies Dictionary

export default settingsNavContent
