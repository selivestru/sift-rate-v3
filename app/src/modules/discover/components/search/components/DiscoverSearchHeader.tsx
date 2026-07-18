import { mediaTypeMeta, type MediaType } from '~/common/constants/media-type'

interface DiscoverSearchHeaderProps {
  mediaType: MediaType
  title: string
  description: string
  resultCount?: number
}

export const DiscoverSearchHeader = ({
  mediaType,
  title,
  description,
  resultCount,
}: DiscoverSearchHeaderProps) => {
  const meta = mediaTypeMeta[mediaType]
  const Icon = meta.icon

  return (
    <div className="flex flex-col gap-2">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-90"
        aria-hidden
        style={{
          background: `radial-gradient(ellipse 90% 80% at 18% 0%, color-mix(in oklab, ${meta.color} 22%, transparent), transparent 70%), radial-gradient(ellipse 70% 55% at 92% 8%, color-mix(in oklab, ${meta.color} 10%, transparent), transparent 65%)`,
        }}
      />

      <div className="flex items-center gap-2.5">
        <span
          className="flex size-9 items-center justify-center rounded-xl"
          style={{
            color: meta.color,
            backgroundColor: `color-mix(in oklab, ${meta.color} 14%, transparent)`,
          }}
        >
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
        <p className="text-muted text-xs font-medium tracking-wide uppercase">{meta.label}</p>
      </div>

      <h1 className="text-foreground text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        {title}
      </h1>

      <p className="text-muted max-w-md text-sm leading-relaxed text-pretty">{description}</p>

      <p className="text-muted h-4 text-xs tabular-nums">
        {resultCount !== undefined &&
          (resultCount === 0
            ? 'No results'
            : `${resultCount.toLocaleString()} result${resultCount === 1 ? '' : 's'}`)}
      </p>
    </div>
  )
}
