import {
  CompassIcon,
  LayersIcon,
  MessagesSquareIcon,
  StarIcon,
  type LucideIcon,
} from 'lucide-react'

import { Badge } from '~/common/ui/Badge'

const mediaTypes = ['Movies', 'TV', 'Tracks', 'Albums', 'Games', 'Books'] as const

const capabilities: {
  icon: LucideIcon
  title: string
  description: string
}[] = [
  {
    icon: StarIcon,
    title: 'Rate and review',
    description: 'Log what you finish and how it felt',
  },
  {
    icon: LayersIcon,
    title: 'Collections and ranked lists',
    description: 'Organize taste into lists you actually revisit',
  },
  {
    icon: MessagesSquareIcon,
    title: 'Reviews and comments',
    description: 'Read other voices and leave your own',
  },
  {
    icon: CompassIcon,
    title: 'Discover',
    description: 'Find the next thing through people, not algorithms alone',
  },
]

export const AuthBrandPanel = () => {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden p-8 lg:p-12">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 -left-16 size-72 rounded-full bg-[oklch(54.09%_0.2471_299.89/0.28)] blur-3xl" />
        <div className="absolute top-1/3 -right-20 size-80 rounded-full bg-[oklch(54.09%_0.2_320/0.2)] blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 size-64 rounded-full bg-[oklch(65%_0.12_280/0.18)] blur-3xl" />
      </div>

      <div className="z-px relative">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary flex size-9 items-center justify-center rounded-xl text-sm font-semibold">
            C
          </span>
          <span className="text-lg font-semibold tracking-tight">SiftRate</span>
        </div>
      </div>

      <div className="z-px relative max-w-lg space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-balance lg:text-4xl">
            Media is part of your life
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed text-pretty lg:text-[1.05rem]">
            SiftRate is a social media tracking platform. Build a personal history through the
            films, shows, games, books, and music that shaped you.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed text-pretty lg:text-base">
            Rate and review, then explore what others wrote and join the conversation with comments.
          </p>
        </div>

        <ul className="flex flex-wrap gap-2">
          {mediaTypes.map((label) => (
            <li key={label}>
              <Badge>{label}</Badge>
            </li>
          ))}
        </ul>

        <ul className="space-y-4">
          {capabilities.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-3">
              <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                <Icon className="size-4" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 space-y-0.5 pt-0.5">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-muted-foreground z-px relative text-xs">
        Your archive. Their reviews. Shared moments.
      </p>
    </div>
  )
}
