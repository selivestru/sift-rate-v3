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
  },
} satisfies Dictionary

export default changeAvatarFormContent
