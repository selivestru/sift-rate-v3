import { MonitorIcon } from 'lucide-react'

import { cn } from '~/common/utils/cn'

import type { GamePlatform } from '../types/game-detail.types'

interface GamePlatformsProps {
  platforms: GamePlatform[]
  className?: string
}

const PLATFORM_PRIORITY = [
  'pc',
  'windows',
  'mac',
  'macos',
  'linux',
  'playstation 5',
  'playstation 4',
  'playstation',
  'xbox series',
  'xbox one',
  'xbox',
  'nintendo switch',
  'switch',
  'nintendo',
  'steam deck',
  'ios',
  'android',
]

const priorityOf = (name: string) => {
  const lower = name.toLowerCase()
  const index = PLATFORM_PRIORITY.findIndex((key) => lower.includes(key))
  return index === -1 ? PLATFORM_PRIORITY.length : index
}

export const GamePlatforms = ({ platforms, className }: GamePlatformsProps) => {
  if (platforms.length === 0) return null

  const sorted = [...platforms].sort(
    (a, b) => priorityOf(a.name) - priorityOf(b.name) || a.name.localeCompare(b.name),
  )

  return (
    <section className={cn('min-w-0', className)} aria-labelledby="platforms-heading">
      <div className="mb-3 flex items-center gap-2">
        <MonitorIcon className="text-muted-foreground size-4" aria-hidden />
        <h2 id="platforms-heading" className="text-foreground text-lg font-semibold">
          Platforms
        </h2>
      </div>

      <ul className="flex flex-wrap gap-2">
        {sorted.map((platform) => (
          <li key={platform.name}>
            <div
              className={cn(
                'bg-card/70 text-foreground ring-border/60',
                'flex min-h-11 items-center gap-2 rounded-xl px-3.5 py-2 ring-1',
              )}
            >
              <span
                className="bg-foreground/8 text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold tracking-wide uppercase"
                aria-hidden
              >
                {(platform.abbreviation || platform.name).slice(0, 3)}
              </span>
              <span className="text-sm font-medium text-pretty">{platform.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
