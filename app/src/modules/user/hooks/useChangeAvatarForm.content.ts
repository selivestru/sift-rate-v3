import { t, type Dictionary } from 'intlayer'

const changeAvatarFormContent = {
  key: 'user-change-avatar-form',
  content: {
    invalidType: t({
      en: 'Use a JPEG, PNG, or WebP image.',
      uk: 'Використовуйте зображення JPEG, PNG або WebP.',
      ru: 'Используйте изображение JPEG, PNG или WebP.',
    }),
    maxSize: t({
      en: 'Image must be 5MB or smaller.',
      uk: 'Зображення має бути не більше 5 МБ.',
      ru: 'Изображение должно быть не больше 5 МБ.',
    }),
    previewError: t({
      en: 'Could not preview this image.',
      uk: 'Не вдалося переглянути це зображення.',
      ru: 'Не удалось просмотреть это изображение.',
    }),
    updated: t({
      en: 'Avatar updated',
      uk: 'Аватар оновлено',
      ru: 'Аватар обновлён',
    }),
  },
} satisfies Dictionary

export default changeAvatarFormContent
