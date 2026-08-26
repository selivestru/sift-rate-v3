import { useIntlayer } from 'react-intlayer'
import { Layers } from 'reicon-react'

import { mediaTypeList, mediaTypeMeta, type MediaType } from '~/common/constants/media-type'
import { useMediaTypeLabels } from '~/common/i18n'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/common/ui/Select'

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
  const content = useIntlayer('review-media-type-select')
  const shared = useIntlayer('shared')
  const mediaTypeLabels = useMediaTypeLabels()
  const items = [
    { value: null, label: shared.all.value },
    ...mediaTypeList.map((item) => ({
      value: item.type,
      label: mediaTypeLabels[item.type],
    })),
  ]

  return (
    <Select
      value={value ?? null}
      onValueChange={(next) => onChange(next ?? undefined)}
      items={items}
    >
      <SelectTrigger aria-label={content.filterByMediaType.value}>
        <SelectValue placeholder={shared.all.value}>
          {(selected: MediaType | null) => {
            if (selected == null) {
              return (
                <span className="text-primary inline-flex items-center gap-1.5">
                  <Layers />
                  {shared.all.value}
                </span>
              )
            }

            const meta = mediaTypeMeta[selected]
            const Icon = meta.icon

            return (
              <span className="inline-flex items-center gap-1.5" style={{ color: meta.color }}>
                <Icon />
                {mediaTypeLabels[selected]}
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
