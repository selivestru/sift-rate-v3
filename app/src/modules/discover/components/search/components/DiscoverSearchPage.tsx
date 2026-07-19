import { useNavigate } from '@tanstack/react-router'

import { mediaTypeMeta } from '~/common/constants/media-type'
import { BlurMorph } from '~/common/ui/BlurMorph'
import { PaginationBar } from '~/common/ui/PaginationBar'
import { cn } from '~/common/utils/cn'

import { useDiscoverSearchQuery } from '../hooks/useDiscoverSearchQuery'
import type { DiscoverSearchConfig } from '../types/discover-search.types'
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

  const meta = mediaTypeMeta[config.mediaType]

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
    <BlurMorph.Sections
      className={cn('relative flex flex-col gap-4 p-4 sm:p-6', {
        'pointer-events-none': isFetching,
      })}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-90"
        aria-hidden
        style={{
          background: `radial-gradient(ellipse 90% 80% at 18% 0%, color-mix(in oklab, ${meta.color} 22%, transparent), transparent 70%), radial-gradient(ellipse 70% 55% at 92% 8%, color-mix(in oklab, ${meta.color} 10%, transparent), transparent 65%)`,
        }}
      />

      <BlurMorph.SectionsItem>
        <DiscoverSearchHeader
          mediaType={config.mediaType}
          title={config.title}
          description={config.description}
          resultCount={showResultCount ? total : undefined}
        />
      </BlurMorph.SectionsItem>

      <BlurMorph.SectionsItem>
        <DiscoverSearchForm
          initialQuery={q}
          placeholder={config.searchPlaceholder}
          isFetching={isFetching}
          onSearch={commitSearch}
        />
      </BlurMorph.SectionsItem>

      <BlurMorph.SectionsItem>
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
      </BlurMorph.SectionsItem>

      {showPagination && (
        <BlurMorph.SectionsItem className="z-px sticky right-0 bottom-4 left-0 flex justify-center">
          <PaginationBar page={page} totalPages={totalPages} onPageChange={changePage} />
        </BlurMorph.SectionsItem>
      )}
    </BlurMorph.Sections>
  )
}
