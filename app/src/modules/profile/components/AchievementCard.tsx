import {
  BookOpen,
  Clapperboard,
  Compass,
  Flame,
  List,
  PenLine,
  Star,
  Trophy,
  Users,
  type IconComponent,
} from 'reicon-react'

import { cn } from '~/common/utils/cn'

import type { Achievement } from '../types/profile.types'
import { rarityMeta } from '../utils/rarity'

interface AchievementCardProps {
  achievement: Achievement
}

const iconMap: Record<string, IconComponent> = {
  Clapperboard,
  BookOpen,
  Flame,
  Compass,
  PenLine,
  List,
  Users,
  Star,
  Trophy,
}

export const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const Icon = iconMap[achievement.iconName] ?? Trophy
  const isUnlocked = achievement.unlockedAt !== null
  const rarity = rarityMeta[achievement.rarity]

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-colors',
        isUnlocked
          ? 'border-border bg-card hover:border-primary/30'
          : 'border-border/50 bg-muted/30 opacity-50',
      )}
    >
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-full',
          isUnlocked ? rarity.icon : 'bg-muted text-muted-foreground',
        )}
      >
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 space-y-1">
        <p className="truncate text-xs font-semibold">{achievement.title}</p>
        {isUnlocked && (
          <p className="text-muted-foreground line-clamp-2 text-xs">{achievement.description}</p>
        )}
      </div>
    </div>
  )
}
