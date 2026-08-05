import { useState } from 'react'

import { useMediaQuery } from '~/common/hooks/useMediaQuery'
import { Button } from '~/common/ui/Button'

import type { Achievement } from '../types/profile.types'
import { sortByRarity } from '../utils/rarity'
import { AchievementCard } from './AchievementCard'
import { AchievementsDialog } from './AchievementsDialog'

interface AchievementsGridProps {
  achievements: Achievement[]
}

export const AchievementsGrid = ({ achievements }: AchievementsGridProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const previewCount = isDesktop ? 4 : 3
  const unlocked = achievements.filter((achievement) => achievement.unlockedAt !== null)
  const locked = achievements.filter((achievement) => achievement.unlockedAt === null)
  const previewSource = unlocked.length > 0 ? unlocked : locked
  const sortedAchievements = sortByRarity(previewSource)
  const hasMore = achievements.length > previewCount
  const unlockedCount = unlocked.length

  if (achievements.length === 0) return null

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Achievements
          <span className="text-muted-foreground ml-2 text-base font-normal tabular-nums">
            {unlockedCount}/{achievements.length}
          </span>
        </h2>
        {hasMore && (
          <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
            View all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 max-md:grid-cols-3">
        {sortedAchievements.slice(0, previewCount).map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      <AchievementsDialog
        achievements={achievements}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </section>
  )
}
