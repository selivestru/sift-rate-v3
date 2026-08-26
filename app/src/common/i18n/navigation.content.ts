import { t, type Dictionary } from 'intlayer'

const navigationContent = {
  key: 'navigation',
  content: {
    home: t({
      en: 'Home',
      uk: 'Головна',
      ru: 'Главная',
    }),
    homeDescription: t({
      en: 'Your activity feed',
      uk: 'Ваша стрічка активності',
      ru: 'Ваша лента активности',
    }),
    discover: t({
      en: 'Discover',
      uk: 'Каталог',
      ru: 'Каталог',
    }),
    discoverDescription: t({
      en: 'Find media to archive',
      uk: 'Шукайте медіа для архіву',
      ru: 'Ищите медиа для архива',
    }),
    movieDescription: t({
      en: 'Films to watch and archive',
      uk: 'Фільми, які варто переглянути й зберегти',
      ru: 'Фильмы, которые стоит посмотреть и сохранить',
    }),
    tvShowDescription: t({
      en: 'Series and seasons',
      uk: 'Серіали та сезони',
      ru: 'Сериалы и сезоны',
    }),
    trackDescription: t({
      en: 'Single moments',
      uk: 'Окремі моменти',
      ru: 'Отдельные моменты',
    }),
    albumDescription: t({
      en: 'Full listens',
      uk: 'Повні прослуховування',
      ru: 'Полные прослушивания',
    }),
    gameDescription: t({
      en: 'Playthroughs ahead',
      uk: 'Майбутні проходження',
      ru: 'Будущие прохождения',
    }),
    bookDescription: t({
      en: 'Pages and shelves',
      uk: 'Сторінки та полиці',
      ru: 'Страницы и полки',
    }),
    library: t({
      en: 'Library',
      uk: 'Бібліотека',
      ru: 'Библиотека',
    }),
    libraryDescription: t({
      en: 'Your media library',
      uk: 'Ваша медіатека',
      ru: 'Ваша медиатека',
    }),
    reviews: t({
      en: 'Reviews',
      uk: 'Рецензії',
      ru: 'Рецензии',
    }),
    reviewsDescription: t({
      en: 'Everything you have scored and reviewed',
      uk: 'Усе, що ви оцінили й описали',
      ru: 'Всё, что вы оценили и описали',
    }),
    rankedLists: t({
      en: 'Ranked Lists',
      uk: 'Рейтинги',
      ru: 'Рейтинги',
    }),
    rankedListsDescription: t({
      en: 'Ordered rankings you build over time',
      uk: 'Упорядковані рейтинги, які ви збираєте з часом',
      ru: 'Упорядоченные рейтинги, которые вы собираете со временем',
    }),
    planned: t({
      en: 'Planned',
      uk: 'Заплановане',
      ru: 'Запланированное',
    }),
    plannedDescription: t({
      en: 'What you mean to watch, play, or read next',
      uk: 'Те, що ви плануєте переглянути, пройти чи прочитати далі',
      ru: 'То, что вы планируете посмотреть, пройти или прочитать дальше',
    }),
  },
} satisfies Dictionary

export default navigationContent
