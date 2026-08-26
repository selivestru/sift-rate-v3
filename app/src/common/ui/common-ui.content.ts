import { insert, t, type Dictionary } from 'intlayer'

const commonUiContent = {
  key: 'common-ui',
  content: {
    imageGallery: t({
      en: 'Image gallery',
      uk: 'Галерея зображень',
      ru: 'Галерея изображений',
    }),
    imageOf: insert(
      t({
        en: '{{current}} of {{total}}',
        uk: '{{current}} з {{total}}',
        ru: '{{current}} из {{total}}',
      }),
    ),
    lightboxHelpMultiple: t({
      en: 'Use arrow keys to navigate between images. Press Escape to close.',
      uk: 'Використовуйте стрілки, щоб переглядати зображення. Натисніть Escape, щоб закрити.',
      ru: 'Используйте стрелки, чтобы листать изображения. Нажмите Escape, чтобы закрыть.',
    }),
    lightboxHelpSingle: t({
      en: 'Press Escape to close.',
      uk: 'Натисніть Escape, щоб закрити.',
      ru: 'Нажмите Escape, чтобы закрыть.',
    }),
    previousImage: t({
      en: 'Previous image',
      uk: 'Попереднє зображення',
      ru: 'Предыдущее изображение',
    }),
    nextImage: t({
      en: 'Next image',
      uk: 'Наступне зображення',
      ru: 'Следующее изображение',
    }),
  },
} satisfies Dictionary

export default commonUiContent
