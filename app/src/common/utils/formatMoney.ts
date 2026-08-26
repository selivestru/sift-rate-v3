import { getCurrentLocale } from '~/common/i18n'

export const formatMoney = (amount: number | null | undefined) => {
  if (amount == null || amount <= 0) return null

  return new Intl.NumberFormat(getCurrentLocale(), {
    style: 'currency',
    currency: 'USD',
    notation: amount >= 1_000_000 ? 'compact' : 'standard',
    maximumFractionDigits: amount >= 1_000_000 ? 1 : 0,
  }).format(amount)
}
