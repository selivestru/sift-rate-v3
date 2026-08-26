import { t, type Dictionary } from 'intlayer'

const podiumContent = {
  key: 'podium',
  content: {
    first: t({ en: '1st', uk: '1-ше', ru: '1-е' }),
    second: t({ en: '2nd', uk: '2-ге', ru: '2-е' }),
    third: t({ en: '3rd', uk: '3-тє', ru: '3-е' }),
    open: t({ en: 'Open', uk: 'Вільно', ru: 'Свободно' }),
  },
} satisfies Dictionary

export default podiumContent
