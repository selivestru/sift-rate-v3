import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useIntlayer } from 'react-intlayer'
import { ChevronLeft, Film } from 'reicon-react'
import { toast } from 'sonner'

import { getApiError, toastApiError, translateApiErrorMessage } from '~/common/api'
import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { getCurrentLocale } from '~/common/i18n'
import { Button } from '~/common/ui/Button'
import { ErrorState } from '~/common/ui/ErrorState'
import { PageHeader } from '~/common/ui/PageHeader'
import { useAuthStore } from '~/modules/auth'
import { SettingsSection } from '~/modules/settings'

import { IMDB_IMPORT_MAX_ROWS } from '../constants/imdb-import'
import { useGetActiveImdbImportQuery } from '../hooks/useGetActiveImdbImportQuery'
import { useGetImdbImportQuery } from '../hooks/useGetImdbImportQuery'
import { useRetryImdbImportMutation } from '../hooks/useRetryImdbImportMutation'
import { useUploadImdbImportMutation } from '../hooks/useUploadImdbImportMutation'
import { ImdbImportHistory } from './ImdbImportHistory'
import { ImdbImportJobStatus } from './ImdbImportJobStatus'
import { ImdbImportSkeleton } from './ImdbImportSkeleton'
import { ImdbImportUpload } from './ImdbImportUpload'

export const ImdbImportPage = () => {
  const content = useIntlayer('imdb-import-page')
  const shared = useIntlayer('shared')
  const settingsNav = useIntlayer('settings-nav')
  const queryClient = useQueryClient()
  const [viewedJobId, setViewedJobId] = useState<string | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  const activeQuery = useGetActiveImdbImportQuery()
  const activeJob = activeQuery.data ?? null
  const jobId = viewedJobId ?? activeJob?.id ?? null
  const jobQuery = useGetImdbImportQuery(jobId)
  const job = jobQuery.data ?? null
  const jobStatus = job?.status ?? null

  const uploadMutation = useUploadImdbImportMutation()
  const retryMutation = useRetryImdbImportMutation()

  useEffect(() => {
    if (jobStatus !== 'COMPLETED' && jobStatus !== 'FAILED') return

    queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.imdbImportHistory })

    if (jobId !== null && jobId === activeJob?.id) {
      queryClient.setQueryData(QUERIES_KEYS.imdbImportActive, null)
    }

    if (jobStatus === 'COMPLETED') {
      const username = useAuthStore.getState().user?.username

      if (username) {
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.profile(username) })
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.userFeed(username) })
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.userActivity(username) })
      }

      queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.feed })
      queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.myReviews })
      queryClient.invalidateQueries({ queryKey: ['media-reviews'] })
      queryClient.invalidateQueries({ queryKey: ['media-state'] })
      queryClient.invalidateQueries({ queryKey: ['my-review-stats'] })
    }
  }, [jobStatus, jobId, activeJob?.id, queryClient])

  const handleUpload = async (file: File) => {
    try {
      const created = await uploadMutation.mutateAsync(file)
      setViewedJobId(created.id)
      setIsCreatingNew(false)
    } catch (error) {
      const apiError = await getApiError(error)

      if (apiError.status === 409) {
        const { data } = await activeQuery.refetch()
        if (data) {
          setViewedJobId(data.id)
          setIsCreatingNew(false)
        }
      }

      toast.error(translateApiErrorMessage(apiError.message))
    }
  }

  const handleRetry = async () => {
    if (!job) return

    try {
      await retryMutation.mutateAsync(job.id)
    } catch (error) {
      await toastApiError(error)
    }
  }

  const handleSelectJob = (id: string) => {
    setViewedJobId(id)
    setIsCreatingNew(false)
  }

  const handleViewActive = () => {
    setViewedJobId(null)
    setIsCreatingNew(false)
  }

  const showJob = job !== null && !isCreatingNew
  const isResolvingJob =
    job === null && (activeQuery.isLoading || (jobId !== null && jobQuery.isLoading))
  const jobLoadError = job === null && (activeQuery.isError || (jobId !== null && jobQuery.isError))
  const isViewingPastImport =
    showJob && activeJob !== null && job !== null && job.id !== activeJob.id

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <div className="flex flex-col gap-3">
        <Link
          to="/settings/imports"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/40 flex w-fit items-center gap-1 rounded-md text-xs font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        >
          <ChevronLeft className="size-4" aria-hidden />
          {content.backToImports.value}
        </Link>
        <PageHeader
          icon={Film}
          label={settingsNav.imports.value}
          title={content.title.value}
          description={content.description.value}
        />
      </div>

      {isResolvingJob && <ImdbImportSkeleton />}

      {jobLoadError && (
        <ErrorState
          border
          title={shared.somethingWentWrong.value}
          description={content.loadErrorDescription.value}
          onRetry={() => {
            void activeQuery.refetch()
            void jobQuery.refetch()
          }}
        />
      )}

      {isViewingPastImport && (
        <div className="border-border bg-card flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3">
          <p className="text-muted-foreground text-xs leading-relaxed">
            {content.pastImportDescription.value}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={handleViewActive}>
            {content.viewActiveImport.value}
          </Button>
        </div>
      )}

      {showJob && (
        <ImdbImportJobStatus
          job={job}
          isRetrying={retryMutation.isPending}
          onRetry={() => void handleRetry()}
          onNewImport={() => setIsCreatingNew(true)}
        />
      )}

      {!showJob && !isResolvingJob && !jobLoadError && (
        <>
          <SettingsSection
            title={content.uploadTitle.value}
            description={content.uploadDescription.value}
          >
            <ImdbImportUpload isUploading={uploadMutation.isPending} onUpload={handleUpload} />
          </SettingsSection>

          <SettingsSection
            title={content.whatGetsImported.value}
            description={content.whatGetsImportedDescription.value}
          >
            <ul className="text-muted-foreground list-inside list-disc space-y-1.5 text-sm leading-relaxed">
              <li>{content.requiredColumns.value}</li>
              <li>
                {
                  content.rowAndFileLimit({
                    rows: IMDB_IMPORT_MAX_ROWS.toLocaleString(getCurrentLocale()),
                    size: 5,
                  }).value
                }
              </li>
              <li>{content.supportedTypes.value}</li>
              <li>{content.existingRatings.value}</li>
              <li>{content.oneImportAtATime.value}</li>
            </ul>
          </SettingsSection>
        </>
      )}

      <ImdbImportHistory selectedJobId={showJob ? jobId : null} onSelect={handleSelectJob} />
    </div>
  )
}
