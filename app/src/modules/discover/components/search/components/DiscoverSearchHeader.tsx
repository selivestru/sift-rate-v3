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
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {meta.label}
        </p>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h1>

      <p className="text-muted-foreground max-w-md text-sm leading-relaxed text-pretty">
        {description}
      </p>

      <p className="text-muted-foreground h-4 text-xs tabular-nums">
        {resultCount !== undefined &&
          (resultCount === 0
            ? 'No results'
            : `${resultCount.toLocaleString()} result${resultCount === 1 ? '' : 's'}`)}
      </p>
    </div>
  )
}
