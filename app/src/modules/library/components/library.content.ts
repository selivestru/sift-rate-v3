import { t, type Dictionary } from 'intlayer'

const libraryContent = {
  key: 'library',
  content: {
    title: t({
      en: 'Your collection',
      uk: 'Ваша колекція',
      ru: 'Ваша коллекция',
    }),
    description: t({
      en: 'Personal archive tools. Ordered, private, yours.',
      uk: 'Інструменти особистого архіву. Упорядковані, приватні, ваші.',
      ru: 'Инструменты личного архива. Упорядоченные, приватные, ваши.',
    }),
    footer: t({
      en: "Looking for something new? Head to Discover for what's next.",
      uk: 'Шукаєте щось нове? Відкрийте каталог, щоб дізнатися, що далі.',
      ru: 'Ищете что-то новое? Откройте каталог, чтобы узнать, что дальше.',
    }),
  },
} satisfies Dictionary

export default libraryContent
