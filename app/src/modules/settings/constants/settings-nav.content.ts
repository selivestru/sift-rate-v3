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
      en: 'Username and display name',
      uk: 'Ім’я користувача та відображуване ім’я',
      ru: 'Имя пользователя и отображаемое имя',
    }),
    appearance: t({
      en: 'Appearance',
      uk: 'Оформлення',
      ru: 'Оформление',
    }),
    appearanceDescription: t({
      en: 'Theme and accent color',
      uk: 'Тема та акцентний колір',
      ru: 'Тема и акцентный цвет',
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
