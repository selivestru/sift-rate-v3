import { insert, t, type Dictionary } from 'intlayer'

const addRankedItemDialogContent = {
  key: 'add-ranked-item-dialog',
  content: {
    title: insert(
      t({
        en: 'Add to “{{title}}”',
        uk: 'Додати до «{{title}}»',
        ru: 'Добавить в «{{title}}»',
      }),
    ),
    description: t({
      en: 'Only media you have already rated can join a ranked list.',
      uk: 'До рейтингу можна додавати лише вже оцінені медіа.',
      ru: 'В рейтинг можно добавлять только уже оценённые медиа.',
    }),
    loadingReviews: t({
      en: 'Loading reviews…',
      uk: 'Завантаження рецензій…',
      ru: 'Загрузка рецензий…',
    }),
    couldNotLoadReviews: t({
      en: 'Couldn’t load reviews.',
      uk: 'Не вдалося завантажити рецензії.',
      ru: 'Не удалось загрузить рецензии.',
    }),
    noMatches: t({ en: 'No matches', uk: 'Збігів не знайдено', ru: 'Совпадений нет' }),
    noRatedMedia: t({
      en: 'No rated media yet',
      uk: 'Оцінених медіа ще немає',
      ru: 'Оценённых медиа пока нет',
    }),
    alreadyOnList: t({
      en: 'Everything here is already on the list',
      uk: 'Усе це вже є в списку',
      ru: 'Всё это уже есть в списке',
    }),
    tryAnotherSearch: t({
      en: 'Try another search.',
      uk: 'Спробуйте інший пошук.',
      ru: 'Попробуйте другой поиск.',
    }),
    rateSomethingFirst: t({
      en: 'Rate something first, then come back to place it on the podium.',
      uk: 'Спочатку оцініть щось, а потім поверніться, щоб додати це на п’єдестал.',
      ru: 'Сначала оцените что-нибудь, а затем вернитесь, чтобы поместить это на пьедестал.',
    }),
    pickDifferentTitle: t({
      en: 'Pick a different title or open Discover to rate more media.',
      uk: 'Оберіть іншу назву або відкрийте каталог, щоб оцінити більше медіа.',
      ru: 'Выберите другое название или откройте каталог, чтобы оценить больше медиа.',
    }),
    searching: t({ en: 'Searching…', uk: 'Пошук…', ru: 'Поиск…' }),
  },
} satisfies Dictionary

export default addRankedItemDialogContent
