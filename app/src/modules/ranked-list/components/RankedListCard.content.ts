import { enu, insert, t, type Dictionary } from 'intlayer'

const rankedListCardContent = {
  key: 'ranked-list-card',
  content: {
    itemCount: t({
      en: insert(enu({ '1': '1 item', fallback: '{{count}} items' })),
      uk: insert(enu({ '1': '1 елемент', fallback: '{{count}} елементів' })),
      ru: insert(enu({ '1': '1 элемент', fallback: '{{count}} элементов' })),
    }),
    edit: insert(
      t({
        en: 'Edit {{title}}',
        uk: 'Редагувати {{title}}',
        ru: 'Редактировать {{title}}',
      }),
    ),
    delete: insert(
      t({
        en: 'Delete {{title}}',
        uk: 'Видалити {{title}}',
        ru: 'Удалить {{title}}',
      }),
    ),
  },
} satisfies Dictionary

export default rankedListCardContent
