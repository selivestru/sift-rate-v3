import type { Achievement, AchievementRarity } from '../types/profile.types'

export const RARITY_ORDER: AchievementRarity[] = ['legendary', 'epic', 'rare', 'common']

export const rarityMeta: Record<
  AchievementRarity,
  { label: string; icon: string; text: string; dot: string }
> = {
  common: {
    label: 'Common',
    icon: 'bg-muted text-muted-foreground',
    text: 'text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
  rare: {
    label: 'Rare',
    icon: 'bg-blue-500/10 text-blue-500',
    text: 'text-blue-500',
    dot: 'bg-blue-500',
  },
  epic: {
    label: 'Epic',
    icon: 'bg-violet-500/10 text-violet-500',
    text: 'text-violet-500',
    dot: 'bg-violet-500',
  },
  legendary: {
    label: 'Legendary',
    icon: 'bg-amber-500/10 text-amber-500',
    text: 'text-amber-500',
    dot: 'bg-amber-500',
  },
}

export const sortByRarity = (achievements: Achievement[]) => {
  const rarityRank = new Map(RARITY_ORDER.map((rarity, index) => [rarity, index]))

  return [...achievements].sort((a, b) => rarityRank.get(a.rarity)! - rarityRank.get(b.rarity)!)
}
