import { t, type Dictionary } from 'intlayer'

const avatarEditorDialogContent = {
  key: 'avatar-editor-dialog',
  content: {
    title: t({
      en: 'Edit photo',
      uk: 'Редагувати фото',
      ru: 'Редактировать фото',
    }),
    description: t({
      en: 'Drag to reposition. Use the slider or pinch to zoom.',
      uk: 'Перетягніть, щоб змінити кадр. Масштаб — повзунком або щипком.',
      ru: 'Перетащите, чтобы изменить кадр. Масштаб — ползунком или щипком.',
    }),
    zoom: t({
      en: 'Zoom',
      uk: 'Масштаб',
      ru: 'Масштаб',
    }),
    confirm: t({
      en: 'Continue',
      uk: 'Продовжити',
      ru: 'Продолжить',
    }),
    cropError: t({
      en: 'Could not crop this image.',
      uk: 'Не вдалося обрізати це зображення.',
      ru: 'Не удалось обрезать это изображение.',
    }),
    previewTitle: t({
      en: 'Preview avatar',
      uk: 'Попередній перегляд аватара',
      ru: 'Предпросмотр аватара',
    }),
    previewDescription: t({
      en: 'This is how your avatar will look.',
      uk: 'Так виглядатиме ваш аватар.',
      ru: 'Так будет выглядеть ваш аватар.',
    }),
    newAvatarPreview: t({
      en: 'New avatar preview',
      uk: 'Попередній перегляд нового аватара',
      ru: 'Предпросмотр нового аватара',
    }),
    saveAvatar: t({
      en: 'Save avatar',
      uk: 'Зберегти аватар',
      ru: 'Сохранить аватар',
    }),
  },
} satisfies Dictionary

export default avatarEditorDialogContent
