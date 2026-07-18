import { useNavigate } from '@tanstack/react-router'

import type { MediaType } from '~/common/constants/media-type'
import { PaginationBar } from '~/common/ui/PaginationBar'
import { cn } from '~/common/utils/cn'

import type { DiscoverSearchConfigByMediaType } from '../configs/discover-search.configs'
import { useDiscoverSearchQuery } from '../hooks/useDiscoverSearchQuery'
import { DiscoverSearchContent } from './DiscoverSearchContent'
import { DiscoverSearchForm } from './DiscoverSearchForm'
import { DiscoverSearchHeader } from './DiscoverSearchHeader'

interface DiscoverSearchPageProps<TMediaType extends MediaType = MediaType> {
  config: DiscoverSearchConfigByMediaType[TMediaType]
  search: {
    q?: string
    page?: number
  }
}

export const DiscoverSearchPage = <TMediaType extends MediaType>({
  config,
  search,
}: DiscoverSearchPageProps<TMediaType>) => {
  const navigate = useNavigate()

  const q = search.q ?? ''
  const page = search.page ?? 1

  const { data, enabled, isPending, isError, isFetching, pageSize, isPlaceholderData, refetch } =
    useDiscoverSearchQuery({
      config,
      q,
      page,
    })

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const showResultCount = enabled && data !== undefined
  const showPagination = enabled && !isError && total > pageSize

  const commitSearch = (nextQuery: string) => {
    navigate({
      to: '.',
      search: {
        q: nextQuery,
        page: 1,
      },
    })
  }

  const changePage = (nextPage: number) => {
    navigate({
      to: '.',
      search: {
        q,
        page: nextPage,
      },
    })
  }

  return (
    <div
      className={cn('flex flex-col gap-4 p-4 sm:p-6', {
        'pointer-events-none': isFetching,
      })}
    >
      <DiscoverSearchHeader
        mediaType={config.mediaType}
        title={config.title}
        description={config.description}
        resultCount={showResultCount ? total : undefined}
      />

      <DiscoverSearchForm
        initialQuery={q}
        placeholder={config.searchPlaceholder}
        isFetching={isFetching}
        onSearch={commitSearch}
      />

      <DiscoverSearchContent
        config={config}
        enabled={enabled}
        isFirstFetch={isPending}
        isError={isError}
        isFetching={isFetching}
        items={items}
        query={q.trim()}
        onRetry={refetch}
        isPlaceholderData={isPlaceholderData}
      />

      {showPagination && (
        <div className="z-px sticky right-0 bottom-4 left-0 flex justify-center">
          <PaginationBar page={page} totalPages={totalPages} onPageChange={changePage} />
        </div>
      )}
    </div>
  )
}
