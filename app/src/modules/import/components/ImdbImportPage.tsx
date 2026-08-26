import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ChevronLeft, Film } from 'reicon-react'
import { toast } from 'sonner'

import { getApiError, toastApiError } from '~/common/api'
import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { Button } from '~/common/ui/Button'
import { ErrorState } from '~/common/ui/ErrorState'
import { PageHeader } from '~/common/ui/PageHeader'
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

      toast.error(apiError.message)
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
          All imports
        </Link>
        <PageHeader
          icon={Film}
          label="Imports"
          title="IMDb ratings"
          description="Import the ratings.csv export from your IMDb account. Each row is matched by IMDb ID and added to your library as a rating."
        />
      </div>

      {isResolvingJob && <ImdbImportSkeleton />}

      {jobLoadError && (
        <ErrorState
          border
          title="Could not load the import"
          description="Something went wrong while loading your import status."
          onRetry={() => {
            void activeQuery.refetch()
            void jobQuery.refetch()
          }}
        />
      )}

      {isViewingPastImport && (
        <div className="border-border bg-card flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3">
          <p className="text-muted-foreground text-xs leading-relaxed">
            You are viewing a past import. Another import is active right now.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={handleViewActive}>
            View active import
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
            title="Upload your ratings export"
            description="On IMDb, open Your Ratings and choose Export to download ratings.csv."
          >
            <ImdbImportUpload isUploading={uploadMutation.isPending} onUpload={handleUpload} />
          </SettingsSection>

          <SettingsSection
            title="What gets imported"
            description="A few things worth knowing before you start."
          >
            <ul className="text-muted-foreground list-inside list-disc space-y-1.5 text-sm leading-relaxed">
              <li>
                Required columns: Const, Your Rating, Date Rated, Title, Title Type — all present in
                the standard IMDb export
              </li>
              <li>
                Up to {IMDB_IMPORT_MAX_ROWS.toLocaleString('en-US')} rows per file, 5 MB maximum
              </li>
              <li>
                Movies (including shorts) and TV series are imported; episodes, video games, and
                podcasts are skipped
              </li>
              <li>Ratings you already have in your library are left untouched</li>
              <li>Only one import can run at a time</li>
            </ul>
          </SettingsSection>
        </>
      )}

      <ImdbImportHistory selectedJobId={showJob ? jobId : null} onSelect={handleSelectJob} />
    </div>
  )
}
