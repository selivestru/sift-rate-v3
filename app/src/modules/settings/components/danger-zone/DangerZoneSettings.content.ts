import { t, type Dictionary } from 'intlayer'

const dangerZoneSettingsContent = {
  key: 'danger-zone-settings',
  content: {
    pageDescription: t({
      en: 'Irreversible account actions. Proceed carefully.',
      uk: 'Незворотні дії з обліковим записом. Будьте обережні.',
      ru: 'Необратимые действия с аккаунтом. Действуйте осторожно.',
    }),
    warningTitle: t({
      en: 'Deleting your account cannot be undone',
      uk: 'Видалення облікового запису неможливо скасувати',
      ru: 'Удаление аккаунта невозможно отменить',
    }),
    warningDescription: t({
      en: 'Your personal media archive, reviews, ranked lists, planned items, and profile would be permanently removed. Connected sign-in methods would stop working.',
      uk: 'Ваш особистий медіаархів, рецензії, рейтингові списки, заплановані елементи та профіль буде видалено назавжди. Підключені способи входу перестануть працювати.',
      ru: 'Ваш личный медиаархив, рецензии, рейтинговые списки, запланированные элементы и профиль будут удалены навсегда. Подключённые способы входа перестанут работать.',
    }),
    deleteTitle: t({
      en: 'Delete account',
      uk: 'Видалити обліковий запис',
      ru: 'Удалить аккаунт',
    }),
    deleteDescription: t({
      en: 'Permanently erase your SiftRate account and everything attached to it.',
      uk: 'Назавжди видалити ваш обліковий запис SiftRate і все, що з ним пов’язано.',
      ru: 'Навсегда удалить ваш аккаунт SiftRate и всё, что с ним связано.',
    }),
    reviewsRemoved: t({
      en: 'All reviews and ratings are removed',
      uk: 'Усі рецензії та оцінки буде видалено',
      ru: 'Все рецензии и оценки будут удалены',
    }),
    listsRemoved: t({
      en: 'Ranked lists and planned queue are removed',
      uk: 'Рейтингові списки та чергу запланованого буде видалено',
      ru: 'Рейтинговые списки и очередь запланированного будут удалены',
    }),
    profileUnavailable: t({
      en: 'Profile and username become unavailable',
      uk: 'Профіль та ім’я користувача стануть недоступними',
      ru: 'Профиль и имя пользователя станут недоступны',
    }),
    deleteButton: t({
      en: 'Delete account',
      uk: 'Видалити обліковий запис',
      ru: 'Удалить аккаунт',
    }),
  },
} satisfies Dictionary

export default dangerZoneSettingsContent
