import { t, type Dictionary } from 'intlayer'

const discoverPageContent = {
  key: 'discover-page',
  content: {
    title: t({ en: 'Explore the catalog', uk: 'Дослідити каталог', ru: 'Исследовать каталог' }),
    description: t({
      en: 'Pick a medium and start searching. Six doors into one endless library.',
      uk: 'Оберіть тип медіа та почніть пошук. Шість дверей до однієї безмежної бібліотеки.',
      ru: 'Выберите тип медиа и начните поиск. Шесть дверей в одну бесконечную библиотеку.',
    }),
    footer: t({
      en: 'Discover is for finding something new. Your ratings and lists live in Library.',
      uk: 'Каталог допомагає знаходити нове. Ваші оцінки та списки зберігаються в Бібліотеці.',
      ru: 'Каталог помогает находить новое. Ваши оценки и списки находятся в Библиотеке.',
    }),
  },
} satisfies Dictionary

export default discoverPageContent
