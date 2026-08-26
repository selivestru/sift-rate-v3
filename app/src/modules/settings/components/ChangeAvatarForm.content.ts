import { t, type Dictionary } from 'intlayer'

const changeAvatarFormContent = {
  key: 'change-avatar-form',
  content: {
    title: t({
      en: 'Avatar',
      uk: 'Аватар',
      ru: 'Аватар',
    }),
    description: t({
      en: 'Shown on your profile, reviews, and in the header. JPEG, PNG, or WebP up to 5MB.',
      uk: 'Відображається у вашому профілі, рецензіях і в шапці. JPEG, PNG або WebP до 5 МБ.',
      ru: 'Отображается в вашем профиле, рецензиях и шапке. JPEG, PNG или WebP до 5 МБ.',
    }),
    chooseImage: t({
      en: 'Choose image',
      uk: 'Вибрати зображення',
      ru: 'Выбрать изображение',
    }),
    chooseAvatarImage: t({
      en: 'Choose avatar image',
      uk: 'Вибрати зображення аватара',
      ru: 'Выбрать изображение аватара',
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

export default changeAvatarFormContent
