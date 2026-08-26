import { t, type Dictionary } from 'intlayer'

const reviewListEmptyContent = {
  key: 'review-list-empty',
  content: {
    noMatches: t({
      en: 'No matches',
      uk: 'Збігів не знайдено',
      ru: 'Совпадений нет',
    }),
    noMatchesDescription: t({
      en: 'Nothing in your archive matches this search. Try another title or keyword.',
      uk: 'У вашому архіві нічого не відповідає цьому пошуку. Спробуйте іншу назву або ключове слово.',
      ru: 'В вашем архиве ничего не соответствует этому поиску. Попробуйте другое название или ключевое слово.',
    }),
    archiveDescription: t({
      en: 'Your rated media will live here as a personal archive. Rate something in Discover to start.',
      uk: 'Тут зберігатимуться оцінені медіа у вашому особистому архіві. Оцініть щось у каталозі, щоб почати.',
      ru: 'Здесь будут храниться оценённые медиа в вашем личном архиве. Оцените что-нибудь в каталоге, чтобы начать.',
    }),
  },
} satisfies Dictionary

export default reviewListEmptyContent
