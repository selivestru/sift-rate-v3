import { insert, t, type Dictionary } from 'intlayer'

const feedContent = {
  key: 'feed',
  content: {
    emptyDescription: t({
      en: 'Ratings and reviews from across SiftRate will show up here.',
      uk: 'Тут з’являтимуться оцінки та рецензії з усього SiftRate.',
      ru: 'Здесь будут появляться оценки и рецензии со всего SiftRate.',
    }),
    openProfile: insert(
      t({
        en: "Open {{name}}'s profile",
        uk: 'Відкрити профіль {{name}}',
        ru: 'Открыть профиль {{name}}',
      }),
    ),
  },
} satisfies Dictionary

export default feedContent
