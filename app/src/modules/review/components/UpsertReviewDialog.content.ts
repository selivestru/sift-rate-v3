import { insert, t, type Dictionary } from 'intlayer'

const upsertReviewDialogContent = {
  key: 'upsert-review-dialog',
  content: {
    pickScore: t({
      en: 'Pick a score',
      uk: 'Оберіть оцінку',
      ru: 'Выберите оценку',
    }),
    tapToChange: t({
      en: 'Tap to change',
      uk: 'Натисніть, щоб змінити',
      ru: 'Нажмите, чтобы изменить',
    }),
    ratingAria: t({
      en: 'Rating from 1 to 10',
      uk: 'Оцінка від 1 до 10',
      ru: 'Оценка от 1 до 10',
    }),
    rateAria: insert(
      t({
        en: 'Rate {{value}} out of 10',
        uk: 'Оцінити на {{value}} з 10',
        ru: 'Оценить на {{value}} из 10',
      }),
    ),
    reviewOptional: t({
      en: 'Review (optional)',
      uk: 'Рецензія (необов’язково)',
      ru: 'Рецензия (необязательно)',
    }),
    placeholder: t({
      en: 'What stayed with you?',
      uk: 'Що вам запам’яталося?',
      ru: 'Что вам запомнилось?',
    }),
    saveRating: t({
      en: 'Save rating',
      uk: 'Зберегти оцінку',
      ru: 'Сохранить оценку',
    }),
  },
} satisfies Dictionary

export default upsertReviewDialogContent
