import { useNavigate } from '@tanstack/react-router'

import { PaginationBar } from '~/common/ui/PaginationBar'

import { useDiscoverSearchQuery } from '../../hooks/useDiscoverSearchQuery'
import type { DiscoverSearchConfig } from '../../types/discover-search.types'
import { DiscoverSearchContent } from './DiscoverSearchContent'
import { DiscoverSearchForm } from './DiscoverSearchForm'
import { DiscoverSearchHeader } from './DiscoverSearchHeader'

interface DiscoverSearchPageProps<T> {
  config: DiscoverSearchConfig<T>
  search: {
    q?: string
    page?: number
  }
}

export const DiscoverSearchPage = <T,>({ config, search }: DiscoverSearchPageProps<T>) => {
  const navigate = useNavigate()

  const q = search.q ?? ''
  const page = search.page ?? 1

  const { data, enabled, isPending, isError, isFetching, pageSize, isPlaceholderData, refetch } =
    useDiscoverSearchQuery({
      config,
      q,
      page,
    })

  const items = data?.results ?? []
  const total = data?.totalResults ?? 0
  const totalPages = data?.totalPages ?? 0
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
    <div className="relative flex flex-col gap-4 p-4 sm:p-6">
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

      <div className={isPending ? 'pointer-events-none opacity-80' : undefined}>
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
      </div>

      {showPagination && (
        <div className="z-px sticky right-0 bottom-4 left-0 flex justify-center">
          <PaginationBar page={page} totalPages={totalPages} onPageChange={changePage} />
        </div>
      )}
    </div>
  )
}
