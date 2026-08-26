import { t, type Dictionary } from 'intlayer'

const reviewMediaTypeSelectContent = {
  key: 'review-media-type-select',
  content: {
    filterByMediaType: t({
      en: 'Filter by media type',
      uk: 'Фільтрувати за типом медіа',
      ru: 'Фильтровать по типу медиа',
    }),
  },
} satisfies Dictionary

export default reviewMediaTypeSelectContent
