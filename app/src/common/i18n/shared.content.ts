import { t, type Dictionary } from 'intlayer'

const sharedContent = {
  key: 'shared',
  content: {
    cancel: t({
      en: 'Cancel',
      uk: 'Скасувати',
      ru: 'Отмена',
    }),
    delete: t({
      en: 'Delete',
      uk: 'Видалити',
      ru: 'Удалить',
    }),
    retry: t({
      en: 'Retry',
      uk: 'Повторити',
      ru: 'Повторить',
    }),
    back: t({
      en: 'Back',
      uk: 'Назад',
      ru: 'Назад',
    }),
    close: t({
      en: 'Close',
      uk: 'Закрити',
      ru: 'Закрыть',
    }),
    save: t({
      en: 'Save',
      uk: 'Зберегти',
      ru: 'Сохранить',
    }),
    edit: t({
      en: 'Edit',
      uk: 'Редагувати',
      ru: 'Редактировать',
    }),
    open: t({
      en: 'Open',
      uk: 'Відкрити',
      ru: 'Открыть',
    }),
    search: t({
      en: 'Search',
      uk: 'Пошук',
      ru: 'Поиск',
    }),
    all: t({
      en: 'All',
      uk: 'Усі',
      ru: 'Все',
    }),
    settings: t({
      en: 'Settings',
      uk: 'Налаштування',
      ru: 'Настройки',
    }),
    menu: t({
      en: 'Menu',
      uk: 'Меню',
      ru: 'Меню',
    }),
    profile: t({
      en: 'Profile',
      uk: 'Профіль',
      ru: 'Профиль',
    }),
    logOut: t({
      en: 'Log Out',
      uk: 'Вийти',
      ru: 'Выйти',
    }),
    signIn: t({
      en: 'Sign in',
      uk: 'Увійти',
      ru: 'Войти',
    }),
    library: t({
      en: 'Library',
      uk: 'Бібліотека',
      ru: 'Библиотека',
    }),
    reviews: t({
      en: 'Reviews',
      uk: 'Рецензії',
      ru: 'Рецензии',
    }),
    loading: t({
      en: 'Loading',
      uk: 'Завантаження',
      ru: 'Загрузка',
    }),
    showMore: t({
      en: 'Show more',
      uk: 'Показати більше',
      ru: 'Показать больше',
    }),
    browseDiscover: t({
      en: 'Browse Discover',
      uk: 'Відкрити Каталог',
      ru: 'Открыть Каталог',
    }),
    trailer: t({
      en: 'Trailer',
      uk: 'Трейлер',
      ru: 'Трейлер',
    }),
    youMightAlsoLike: t({
      en: 'You might also like',
      uk: 'Вам також може сподобатися',
      ru: 'Вам также может понравиться',
    }),
    noReviewsYet: t({
      en: 'No reviews yet',
      uk: 'Рецензій ще немає',
      ru: 'Рецензий пока нет',
    }),
    somethingWentWrong: t({
      en: 'Something went wrong',
      uk: 'Щось пішло не так',
      ru: 'Что-то пошло не так',
    }),
    tryAgainLater: t({
      en: 'Please try again later.',
      uk: 'Спробуйте ще раз пізніше.',
      ru: 'Попробуйте ещё раз позже.',
    }),
    selectedSuffix: t({
      en: ', selected',
      uk: ', вибрано',
      ru: ', выбрано',
    }),
    openMenu: t({
      en: 'Open menu',
      uk: 'Відкрити меню',
      ru: 'Открыть меню',
    }),
    language: t({
      en: 'Language',
      uk: 'Мова',
      ru: 'Язык',
    }),
    prev: t({
      en: 'Prev',
      uk: 'Назад',
      ru: 'Назад',
    }),
    next: t({
      en: 'Next',
      uk: 'Далі',
      ru: 'Далее',
    }),
    pagination: t({
      en: 'Pagination',
      uk: 'Пагінація',
      ru: 'Пагинация',
    }),
    copied: t({
      en: 'Copied',
      uk: 'Скопійовано',
      ru: 'Скопировано',
    }),
    copySecretKey: t({
      en: 'Copy secret key',
      uk: 'Скопіювати секретний ключ',
      ru: 'Скопировать секретный ключ',
    }),
    carousel: t({
      en: 'carousel',
      uk: 'карусель',
      ru: 'карусель',
    }),
    slide: t({
      en: 'slide',
      uk: 'слайд',
      ru: 'слайд',
    }),
    previousSlide: t({
      en: 'Previous slide',
      uk: 'Попередній слайд',
      ru: 'Предыдущий слайд',
    }),
    nextSlide: t({
      en: 'Next slide',
      uk: 'Наступний слайд',
      ru: 'Следующий слайд',
    }),
  },
} satisfies Dictionary

export default sharedContent
