import { Archive, Compass, Layers, Star, type IconComponent } from 'reicon-react'

import { Badge } from '~/common/ui/Badge'

const mediaTypes = ['Movies', 'TV', 'Tracks', 'Albums', 'Games', 'Books'] as const

const capabilities: {
  icon: IconComponent
  title: string
  description: string
}[] = [
  {
    icon: Star,
    title: 'Rate and review',
    description: 'Log what you finish and how it felt',
  },
  {
    icon: Layers,
    title: 'Collections and ranked lists',
    description: 'Organize taste into lists you actually revisit',
  },
  {
    icon: Compass,
    title: 'Discover',
    description: 'Find the next thing worth your time',
  },
  {
    icon: Archive,
    title: 'Personal archive',
    description: 'A quiet record of your media life, kept in one place',
  },
]

export const AuthBrandPanel = () => {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden p-8 lg:p-12">
      <div className="z-px relative">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md text-xs font-semibold">
            S
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
            SiftRate is a personal media archive. Build a lasting record of the films, shows, games,
            books, and music that shaped you.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed text-pretty lg:text-base">
            Rate what you finish, write what you think, and browse what others rated along the way.
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
              <span className="bg-accent text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                <Icon className="size-4" strokeWidth={1.75} />
              </span>
              <div className="space-y-0.5 pt-0.5">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-muted-foreground z-px relative text-xs">Your media life, archived.</p>
    </div>
  )
}
