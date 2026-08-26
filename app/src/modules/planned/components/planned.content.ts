import { insert, t, type Dictionary } from 'intlayer'

const plannedContent = {
  key: 'planned',
  content: {
    heroDescription: t({
      en: 'Media you saved for later. Your queue, ready when you are.',
      uk: 'Медіа, які ви зберегли на потім. Ваша черга готова, коли готові ви.',
      ru: 'Медиа, которые вы сохранили на потом. Ваша очередь готова, когда готовы вы.',
    }),
    loadingQueueCount: t({
      en: 'Loading queue count',
      uk: 'Завантаження кількості в черзі',
      ru: 'Загрузка количества в очереди',
    }),
    queueCount: insert(
      t({
        en: '{{count}} in queue',
        uk: '{{count}} у черзі',
        ru: '{{count}} в очереди',
      }),
    ),
    inQueue: t({
      en: 'in queue',
      uk: 'у черзі',
      ru: 'в очереди',
    }),
    emptyTitle: t({
      en: 'Nothing planned yet',
      uk: 'Ще нічого не заплановано',
      ru: 'Пока ничего не запланировано',
    }),
    emptyDescription: t({
      en: 'Save media you want to watch, play, read, or listen to. It will show up here as your backlog.',
      uk: 'Зберігайте медіа, які хочете переглянути, пройти, прочитати чи послухати. Тут вони утворять вашу чергу.',
      ru: 'Сохраняйте медиа, которые хотите посмотреть, пройти, прочитать или послушать. Здесь они станут вашей очередью.',
    }),
    saved: insert(
      t({
        en: 'Saved {{date}}',
        uk: 'Збережено {{date}}',
        ru: 'Сохранено {{date}}',
      }),
    ),
    deleteFromPlanned: insert(
      t({
        en: 'Delete {{title}} from planned',
        uk: 'Видалити «{{title}}» із запланованого',
        ru: 'Удалить «{{title}}» из запланированного',
      }),
    ),
    addToPlanned: t({
      en: 'Add to planned',
      uk: 'Додати до запланованого',
      ru: 'Добавить в запланированное',
    }),
    removeFromPlanned: t({
      en: 'Remove from planned',
      uk: 'Видалити із запланованого',
      ru: 'Удалить из запланированного',
    }),
    planned: t({
      en: 'Planned',
      uk: 'Заплановане',
      ru: 'Запланированное',
    }),
    plan: t({
      en: 'Plan',
      uk: 'Запланувати',
      ru: 'Запланировать',
    }),
  },
} satisfies Dictionary

export default plannedContent
