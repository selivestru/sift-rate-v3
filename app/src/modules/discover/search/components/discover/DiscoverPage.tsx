import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'reicon-react'

import {
  getMediaTypeFromSlug,
  mediaTypeMeta,
  type MediaTypeSlug,
} from '~/common/constants/media-type'
import { discoverChildren, discoverNav } from '~/common/constants/navigation'
import { PageHeader } from '~/common/ui/PageHeader'
import { cn } from '~/common/utils/cn'

export const DiscoverPage = () => {
  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <PageHeader
        icon={discoverNav.icon}
        label={discoverNav.label}
        title="Explore the catalog"
        description="Pick a medium and start searching. Six doors into one endless library."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
        {discoverChildren.map((item) => {
          const slug = item.params?.mediaType as MediaTypeSlug
          const meta = mediaTypeMeta[getMediaTypeFromSlug(slug)]
          const Icon = meta.icon

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'group border-border bg-card relative flex h-full flex-col justify-between overflow-hidden rounded-xl border p-4 sm:p-5',
                'transition-colors duration-200',
                'hover:bg-accent',
                'focus-visible:ring-ring/40 focus-visible:z-px focus-visible:ring-2 focus-visible:outline-none',
              )}
            >
              <div className="relative flex items-start justify-between gap-3">
                <span
                  className="bg-muted flex size-10 items-center justify-center rounded-lg"
                  style={{ color: meta.color }}
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <ChevronRight
                  className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </div>

              <div className="relative mt-8 space-y-1">
                <p className="text-lg font-semibold tracking-tight">{meta.label}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </Link>
          )
        })}
      </div>

      <div>
        <p className="text-muted-foreground border-border border-t pt-4 text-xs leading-relaxed">
          Discover is for finding something new. Your ratings and lists live in Library.
        </p>
      </div>
    </div>
  )
}
