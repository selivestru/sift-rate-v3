import { t, type Dictionary } from 'intlayer'

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
  },
} satisfies Dictionary

export default apiErrorsContent
