import { Layers } from 'reicon-react'

import { mediaTypeList, mediaTypeMeta, type MediaType } from '~/common/constants/media-type'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/common/ui/Select'

const items = [
  { value: null, label: 'All' },
  ...mediaTypeList.map((item) => ({
    value: item.type,
    label: item.label,
  })),
]

interface ReviewMediaTypeSelectProps {
  value?: MediaType
  onChange: (mediaType: MediaType | undefined) => void
  total?: number
  counts?: Partial<Record<MediaType, number>>
}

export const ReviewMediaTypeSelect = ({
  value,
  onChange,
  total = 0,
  counts,
}: ReviewMediaTypeSelectProps) => {
  return (
    <Select
      value={value ?? null}
      onValueChange={(next) => onChange(next ?? undefined)}
      items={items}
    >
      <SelectTrigger aria-label="Filter by media type">
        <SelectValue placeholder="All">
          {(selected: MediaType | null) => {
            if (selected == null) {
              return (
                <span className="text-primary inline-flex items-center gap-1.5">
                  <Layers />
                  All
                </span>
              )
            }

            const meta = mediaTypeMeta[selected]
            const Icon = meta.icon

            return (
              <span className="inline-flex items-center gap-1.5" style={{ color: meta.color }}>
                <Icon />
                {meta.label}
              </span>
            )
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="center" className="w-max">
        {items.map((item) => {
          if (item.value == null) {
            return (
              <SelectItem key="all" value={null}>
                <span className="flex w-full items-center justify-between gap-3">
                  <span className="text-primary inline-flex items-center gap-2">
                    <Layers />
                    {item.label}
                  </span>
                  <span className="text-primary text-xs tabular-nums">{total}</span>
                </span>
              </SelectItem>
            )
          }

          const meta = mediaTypeMeta[item.value]
          const Icon = meta.icon
          const count = counts?.[item.value] ?? 0

          return (
            <SelectItem key={item.value} value={item.value} disabled={count === 0}>
              <span className="flex w-full items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2" style={{ color: meta.color }}>
                  <Icon />
                  {item.label}
                </span>
                <span className="text-primary text-xs tabular-nums">{count}</span>
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
