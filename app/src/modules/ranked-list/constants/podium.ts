export const PODIUM_RANKS = [2, 1, 3] as const

export type PodiumRank = (typeof PODIUM_RANKS)[number]

export const podiumMeta: Record<
  PodiumRank,
  {
    rank: PodiumRank
    labelKey: 'first' | 'second' | 'third'
    heightClass: string
    accent: string
    accentSoft: string
  }
> = {
  1: {
    rank: 1,
    labelKey: 'first',
    heightClass: 'h-40',
    accent: 'oklch(0.82 0.14 85)',
    accentSoft: 'oklch(0.82 0.14 85 / 0.22)',
  },
  2: {
    rank: 2,
    labelKey: 'second',
    heightClass: 'h-34',
    accent: 'oklch(0.78 0.03 260)',
    accentSoft: 'oklch(0.78 0.03 260 / 0.22)',
  },
  3: {
    rank: 3,
    labelKey: 'third',
    heightClass: 'h-30',
    accent: 'oklch(0.72 0.12 55)',
    accentSoft: 'oklch(0.72 0.12 55 / 0.22)',
  },
}
