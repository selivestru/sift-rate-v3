import { User } from 'reicon-react'

import type { MusicContributor } from '../types/music-rail.types'

interface ContributorListProps {
  contributors: MusicContributor[]
}

export const ContributorList = ({ contributors }: ContributorListProps) => {
  if (contributors.length === 0) return null

  return (
    <section className="flex flex-col gap-4" aria-labelledby="credits-heading">
      <h2 id="credits-heading" className="text-foreground text-lg font-semibold">
        Credits
      </h2>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {contributors.map((contributor) => (
          <li
            key={contributor.id}
            className="bg-card ring-border/60 flex items-center gap-3 rounded-xl p-2.5 ring-1"
          >
            {contributor.pictureUrl ? (
              <img
                src={contributor.pictureUrl}
                alt={contributor.name}
                className="size-11 shrink-0 rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="bg-muted flex size-11 shrink-0 items-center justify-center rounded-full">
                <User className="text-muted-foreground size-5" aria-hidden />
              </div>
            )}

            <div className="flex min-w-0 flex-col">
              <p className="text-foreground truncate text-sm font-medium">{contributor.name}</p>
              {contributor.role && (
                <p className="text-muted-foreground truncate text-xs">{contributor.role}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
