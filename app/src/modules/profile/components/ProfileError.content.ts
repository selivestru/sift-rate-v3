import { t, type Dictionary } from 'intlayer'

const profileErrorContent = {
  key: 'profile-error',
  content: {
    userNotFound: t({
      en: 'User not found',
      uk: 'Користувача не знайдено',
      ru: 'Пользователь не найден',
    }),
    profileDoesNotExist: t({
      en: "This profile doesn't exist.",
      uk: 'Цей профіль не існує.',
      ru: 'Этот профиль не существует.',
    }),
    unableToLoadProfile: t({
      en: "Couldn't load profile",
      uk: 'Не вдалося завантажити профіль',
      ru: 'Не удалось загрузить профиль',
    }),
  },
} satisfies Dictionary

export default profileErrorContent
