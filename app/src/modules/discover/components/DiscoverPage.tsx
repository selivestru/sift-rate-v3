import { cn } from '@heroui/styles'
import { Link } from '@tanstack/react-router'
import { CompassIcon } from 'lucide-react'

import { mediaTypeMeta } from '~/common/constants/media-type'
import { BlurMorphSections, BlurMorphSectionsItem } from '~/common/ui/BlurMorph'

import { mediaTypeDestinations } from '../constants/media-types'

export const DiscoverPage = () => {
  return (
    <div className="relative flex flex-col gap-6 overflow-hidden p-4 sm:gap-8 sm:p-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-90"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 20% 0%, oklch(70% 0.14 210 / 0.2), transparent 70%), radial-gradient(ellipse 70% 60% at 90% 10%, oklch(65% 0.12 250 / 0.12), transparent 65%)',
        }}
      />

      <BlurMorphSections className="relative z-10 flex flex-col gap-3">
        <BlurMorphSectionsItem>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-500 dark:text-cyan-300">
              <CompassIcon className="size-4" strokeWidth={1.75} />
            </span>
            <p className="text-muted text-xs font-medium tracking-wide uppercase">Discover</p>
          </div>
        </BlurMorphSectionsItem>
        <BlurMorphSectionsItem>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Explore the catalog
          </h1>
        </BlurMorphSectionsItem>
        <BlurMorphSectionsItem>
          <p className="text-muted max-w-md text-sm leading-relaxed text-pretty">
            Pick a medium and start searching. Six doors into one endless library.
          </p>
        </BlurMorphSectionsItem>
      </BlurMorphSections>

      <BlurMorphSections className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
        {mediaTypeDestinations.map((item) => {
          const meta = mediaTypeMeta[item.type]
          const Icon = meta.icon

          return (
            <BlurMorphSectionsItem key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  'group border-border/70 bg-surface-secondary/50 relative flex h-full min-h-36 flex-col justify-between overflow-hidden rounded-2xl border p-4 sm:min-h-40 sm:p-5',
                  'origin-center transition-all duration-300 ease-out',
                  'hover:z-10 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-surface-secondary/80',
                  'active:scale-[0.98] active:translate-y-0',
                  'focus-visible:ring-accent/40 focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none',
                )}
                style={{
                  '--media-color': meta.color,
                }}
              >
                <div
                  className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full opacity-70 blur-3xl transition-[opacity,transform] duration-300 ease-out group-hover:scale-125 group-hover:opacity-100"
                  style={{ backgroundColor: meta.color }}
                  aria-hidden
                />

                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-60 transition-opacity duration-300 group-hover:opacity-90"
                  style={{
                    background: `linear-gradient(
                      to top,
                      color-mix(in oklab, ${meta.color} 75%, transparent),
                      color-mix(in oklab, ${meta.color} 20%, transparent),
                      transparent
                    )`,
                  }}
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${meta.color} 55%, transparent), 0 12px 32px color-mix(in oklab, ${meta.color} 28%, transparent)`,
                  }}
                  aria-hidden
                />

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <span
                    className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-black/5 shadow-sm backdrop-blur-sm transition-transform duration-300 ease-out group-hover:scale-105 dark:bg-white/10"
                    style={{ color: meta.color }}
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span
                    className="text-muted text-xs font-medium transition-colors duration-300 group-hover:text-(--media-color)"
                    aria-hidden
                  >
                    Open
                  </span>
                </div>

                <div className="relative z-10 mt-8 space-y-1">
                  <p className="text-lg font-semibold tracking-tight">{meta.label}</p>
                  <p className="text-muted text-sm leading-relaxed">{item.description}</p>
                </div>
              </Link>
            </BlurMorphSectionsItem>
          )
        })}
      </BlurMorphSections>

      <BlurMorphSections className="relative z-10">
        <BlurMorphSectionsItem>
          <p className="text-muted border-border/60 border-t pt-4 text-xs leading-relaxed">
            Discover is for finding something new. Your ratings and lists live in Library.
          </p>
        </BlurMorphSectionsItem>
      </BlurMorphSections>
    </div>
  )
}
