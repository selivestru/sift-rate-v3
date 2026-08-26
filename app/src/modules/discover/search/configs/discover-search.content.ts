import { t, type Dictionary } from 'intlayer'

const discoverSearchContent = {
  key: 'discover-search',
  content: {
    MOVIE: {
      title: t({ en: 'Find movies', uk: 'Знайти фільми', ru: 'Найти фильмы' }),
      description: t({
        en: 'Search films to watch and archive in your life timeline.',
        uk: 'Шукайте фільми для перегляду та архівування у своїй часовій шкалі.',
        ru: 'Ищите фильмы для просмотра и архивации в своей временной шкале.',
      }),
      placeholder: t({ en: 'Search movies…', uk: 'Шукати фільми…', ru: 'Искать фильмы…' }),
    },
    TV_SHOW: {
      title: t({ en: 'Find TV shows', uk: 'Знайти серіали', ru: 'Найти сериалы' }),
      description: t({
        en: 'Search series and seasons worth following.',
        uk: 'Шукайте серіали та сезони, за якими варто стежити.',
        ru: 'Ищите сериалы и сезоны, за которыми стоит следить.',
      }),
      placeholder: t({ en: 'Search TV shows…', uk: 'Шукати серіали…', ru: 'Искать сериалы…' }),
    },
    GAME: {
      title: t({ en: 'Find games', uk: 'Знайти ігри', ru: 'Найти игры' }),
      description: t({
        en: 'Search playthroughs ahead of your next session.',
        uk: 'Шукайте ігри для наступного проходження.',
        ru: 'Ищите игры для следующего прохождения.',
      }),
      placeholder: t({ en: 'Search games…', uk: 'Шукати ігри…', ru: 'Искать игры…' }),
    },
    BOOK: {
      title: t({ en: 'Find books', uk: 'Знайти книги', ru: 'Найти книги' }),
      description: t({
        en: 'Search pages and shelves for your archive.',
        uk: 'Шукайте сторінки та полиці для свого архіву.',
        ru: 'Ищите книги для своего архива.',
      }),
      placeholder: t({ en: 'Search books…', uk: 'Шукати книги…', ru: 'Искать книги…' }),
    },
    ALBUM: {
      title: t({ en: 'Find albums', uk: 'Знайти альбоми', ru: 'Найти альбомы' }),
      description: t({
        en: 'Search full listens to keep in your life.',
        uk: 'Шукайте альбоми, які хочеться зберегти у своєму житті.',
        ru: 'Ищите альбомы, которые хочется сохранить в своей жизни.',
      }),
      placeholder: t({ en: 'Search albums…', uk: 'Шукати альбоми…', ru: 'Искать альбомы…' }),
    },
    TRACK: {
      title: t({ en: 'Find tracks', uk: 'Знайти треки', ru: 'Найти треки' }),
      description: t({
        en: 'Search single moments worth remembering.',
        uk: 'Шукайте окремі моменти, які варто запам’ятати.',
        ru: 'Ищите отдельные моменты, которые стоит запомнить.',
      }),
      placeholder: t({ en: 'Search tracks…', uk: 'Шукати треки…', ru: 'Искать треки…' }),
    },
  },
} satisfies Dictionary

export default discoverSearchContent
