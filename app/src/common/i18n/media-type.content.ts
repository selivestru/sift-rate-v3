import { t, type Dictionary } from 'intlayer'

const mediaTypeContent = {
  key: 'media-type',
  content: {
    MOVIE: t({
      en: 'Movies',
      uk: 'Фільми',
      ru: 'Фильмы',
    }),
    TV_SHOW: t({
      en: 'TV Shows',
      uk: 'Серіали',
      ru: 'Сериалы',
    }),
    GAME: t({
      en: 'Games',
      uk: 'Ігри',
      ru: 'Игры',
    }),
    BOOK: t({
      en: 'Books',
      uk: 'Книги',
      ru: 'Книги',
    }),
    ALBUM: t({
      en: 'Albums',
      uk: 'Альбоми',
      ru: 'Альбомы',
    }),
    TRACK: t({
      en: 'Tracks',
      uk: 'Треки',
      ru: 'Треки',
    }),
    MOVIE_ONE: t({
      en: 'Movie',
      uk: 'Фільм',
      ru: 'Фильм',
    }),
    TV_SHOW_ONE: t({
      en: 'Series',
      uk: 'Серіал',
      ru: 'Сериал',
    }),
    GAME_ONE: t({
      en: 'Game',
      uk: 'Гра',
      ru: 'Игра',
    }),
    BOOK_ONE: t({
      en: 'Book',
      uk: 'Книга',
      ru: 'Книга',
    }),
    ALBUM_ONE: t({
      en: 'Album',
      uk: 'Альбом',
      ru: 'Альбом',
    }),
    TRACK_ONE: t({
      en: 'Track',
      uk: 'Трек',
      ru: 'Трек',
    }),
  },
} satisfies Dictionary

export default mediaTypeContent
