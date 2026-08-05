import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/common/ui/Dialog'
import { cn } from '~/common/utils/cn'

import type { Achievement } from '../types/profile.types'
import { RARITY_ORDER, rarityMeta } from '../utils/rarity'
import { AchievementCard } from './AchievementCard'

interface AchievementsDialogProps {
  achievements: Achievement[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AchievementsDialog = ({
  achievements,
  open,
  onOpenChange,
}: AchievementsDialogProps) => {
  const grouped = RARITY_ORDER.map((rarity) => ({
    rarity,
    items: achievements.filter((achievement) => achievement.rarity === rarity),
  })).filter((group) => group.items.length > 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Achievements</DialogTitle>
        </DialogHeader>

        <div className="no-scrollbar max-h-[70dvh] space-y-6 overflow-y-auto">
          {grouped.map(({ rarity, items }) => {
            const meta = rarityMeta[rarity]

            return (
              <div key={rarity} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={cn('size-2 rounded-full', meta.dot)} />
                  <h3 className={cn('text-sm font-semibold uppercase tracking-wide', meta.text)}>
                    {meta.label}
                  </h3>
                  <span className="text-muted-foreground font-normal normal-case tabular-nums">
                    {items.length}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 max-md:grid-cols-3">
                  {items.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
