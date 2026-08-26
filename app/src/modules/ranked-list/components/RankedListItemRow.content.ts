import { insert, t, type Dictionary } from 'intlayer'

const rankedListItemRowContent = {
  key: 'ranked-list-item-row',
  content: {
    moveUp: insert(
      t({
        en: 'Move {{title}} up',
        uk: 'Перемістити {{title}} вище',
        ru: 'Переместить {{title}} выше',
      }),
    ),
    moveDown: insert(
      t({
        en: 'Move {{title}} down',
        uk: 'Перемістити {{title}} нижче',
        ru: 'Переместить {{title}} ниже',
      }),
    ),
    open: insert(
      t({
        en: 'Open {{title}}',
        uk: 'Відкрити {{title}}',
        ru: 'Открыть {{title}}',
      }),
    ),
    remove: insert(
      t({
        en: 'Remove {{title}} from list',
        uk: 'Вилучити {{title}} зі списку',
        ru: 'Удалить {{title}} из списка',
      }),
    ),
  },
} satisfies Dictionary

export default rankedListItemRowContent
