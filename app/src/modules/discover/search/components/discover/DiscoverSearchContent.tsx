import { useMediaTypeLabel } from '~/common/i18n'
import { cn } from '~/common/utils/cn'

import type { DiscoverSearchConfig } from '../../types/discover-search.types'
import { DiscoverSearchEmpty } from './DiscoverSearchEmpty'
import { DiscoverSearchError } from './DiscoverSearchError'
import { DiscoverSearchIdle } from './DiscoverSearchIdle'

type ContentState = 'idle' | 'loading' | 'error' | 'empty' | 'results'

interface DiscoverSearchContentProps<T> {
  config: DiscoverSearchConfig<T>
  enabled: boolean
  isFirstFetch: boolean
  isError: boolean
  isFetching: boolean
  items: T[]
  query: string
  isPlaceholderData: boolean
  onRetry: () => void
}

export const DiscoverSearchContent = <T,>({
  config,
  enabled,
  isFirstFetch,
  isError,
  isFetching,
  items,
  query,
  isPlaceholderData,
  onRetry,
}: DiscoverSearchContentProps<T>) => {
  const skeletonCount = config.skeletonCount
  const Card = config.Card
  const Skeleton = config.Skeleton
  const mediaLabel = useMediaTypeLabel(config.mediaType)

  let state: ContentState = 'idle'

  if (!enabled) {
    state = 'idle'
  } else if (isFirstFetch) {
    state = 'loading'
  } else if (isError) {
    state = 'error'
  } else if (!isError && !isFetching && items.length === 0) {
    state = 'empty'
  } else {
    state = 'results'
  }

  return (
    <>
      {state === 'idle' && <DiscoverSearchIdle mediaLabel={mediaLabel} />}

      {state === 'loading' && (
        <div className={config.resultsClassName}>
          {Array.from({ length: skeletonCount }, (_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      )}

      {state === 'error' && <DiscoverSearchError onRetry={onRetry} />}

      {state === 'empty' && <DiscoverSearchEmpty query={query} />}

      {state === 'results' && (
        <div
          className={cn(config.resultsClassName, {
            'animate-pulse pointer-events-none': isPlaceholderData,
          })}
        >
          {items.map((item) => (
            <Card key={config.getItemKey(item)} item={item} />
          ))}
        </div>
      )}
    </>
  )
}
