import { t, type Dictionary } from 'intlayer'

const rankingListEmptyContent = {
  key: 'ranking-list-empty',
  content: {
    title: t({
      en: 'No ranked lists yet',
      uk: 'Рейтингів ще немає',
      ru: 'Рейтингов пока нет',
    }),
    description: t({
      en: 'Build ordered rankings of media that shaped you. Start with a list, then fill the podium.',
      uk: 'Створюйте впорядковані рейтинги медіа, які вас сформували. Почніть зі списку, а потім заповніть п’єдестал.',
      ru: 'Создавайте упорядоченные рейтинги медиа, которые вас сформировали. Начните со списка, затем заполните пьедестал.',
    }),
    createList: t({ en: 'Create list', uk: 'Створити список', ru: 'Создать список' }),
  },
} satisfies Dictionary

export default rankingListEmptyContent
