import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger, OnModuleInit } from '@nestjs/common'

import { IMDB_IMPORT_JOB, IMDB_IMPORT_QUEUE, ImdbImportJobData } from './constants/import-queue'
import { TmdbFindService } from './services/tmdb-find.service'
import { isUnsupportedImdbTitleType, mapImdbTitleType } from './utils/map-imdb-title-type'
import { Job } from 'bullmq'
import { ImportJobRow, Media, Prisma } from '~/generated/prisma/client'
import { ImportJobStatus, ImportRowStatus, MediaType } from '~/generated/prisma/enums'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
import { MediaService } from '~/modules/media/media.service'

const PROGRESS_BATCH = 50
const STALE_JOB_MS = 30 * 60 * 1000

const PROCESSABLE_STATUSES: ImportRowStatus[] = [
  ImportRowStatus.PENDING,
  ImportRowStatus.NOT_FOUND,
  ImportRowStatus.ERROR,
  ImportRowStatus.SKIPPED_TYPE,
]

@Processor(IMDB_IMPORT_QUEUE)
export class ImportProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(ImportProcessor.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly tmdbFind: TmdbFindService,
  ) {
    super()
  }

  async onModuleInit(): Promise<void> {
    const cutoff = new Date(Date.now() - STALE_JOB_MS)
    const stale = await this.prisma.importJob.updateMany({
      where: {
        status: ImportJobStatus.PROCESSING,
        updatedAt: { lt: cutoff },
      },
      data: {
        status: ImportJobStatus.FAILED,
        errorMessage: 'Import stalled and was marked failed',
        finishedAt: new Date(),
      },
    })

    if (stale.count > 0) {
      this.logger.warn(`Marked ${stale.count} stalled import jobs as failed`)
    }
  }

  async process(job: Job<ImdbImportJobData>): Promise<void> {
    if (job.name !== IMDB_IMPORT_JOB) {
      this.logger.warn(`Unknown job name on ${IMDB_IMPORT_QUEUE}: ${job.name}`)
      return
    }

    const { importJobId } = job.data
    const importJob = await this.prisma.importJob.findUnique({
      where: { id: importJobId },
    })

    if (!importJob) {
      this.logger.warn(`Import job ${importJobId} not found`)
      return
    }

    await this.prisma.importJob.update({
      where: { id: importJobId },
      data: {
        status: ImportJobStatus.PROCESSING,
        errorMessage: null,
        finishedAt: null,
      },
    })

    try {
      await this.processRows(importJobId, importJob.userId)
      await this.finalize(importJobId, ImportJobStatus.COMPLETED)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Import failed'
      this.logger.error(`Import job ${importJobId} failed: ${message}`)
      await this.finalize(importJobId, ImportJobStatus.FAILED, message)
      throw error
    }
  }

  private async processRows(importJobId: string, userId: string): Promise<void> {
    const rows = await this.prisma.importJobRow.findMany({
      where: {
        jobId: importJobId,
        status: { in: PROCESSABLE_STATUSES },
      },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
    })

    await this.syncCounters(importJobId)

    const mediaByImdbId = new Map<string, Media>()
    let sinceLastSync = 0

    for (const row of rows) {
      await this.processRow(userId, row, mediaByImdbId)
      sinceLastSync++

      if (sinceLastSync >= PROGRESS_BATCH) {
        await this.syncCounters(importJobId)
        sinceLastSync = 0
      }
    }

    if (sinceLastSync > 0) {
      await this.syncCounters(importJobId)
    }
  }

  private async processRow(
    userId: string,
    row: ImportJobRow,
    mediaByImdbId: Map<string, Media>,
  ): Promise<void> {
    if (row.rating == null) {
      await this.markRow(row.id, ImportRowStatus.INVALID, 'Invalid rating')
      return
    }

    if (isUnsupportedImdbTitleType(row.titleType)) {
      await this.markRow(row.id, ImportRowStatus.SKIPPED_TYPE)
      return
    }

    try {
      const preferredType = mapImdbTitleType(row.titleType) ?? MediaType.MOVIE
      const media = await this.resolveMedia(row.imdbId, preferredType, row.title, mediaByImdbId)
      if (!media) {
        await this.markRow(row.id, ImportRowStatus.NOT_FOUND, 'Title not found on TMDB')
        return
      }

      const existing = await this.prisma.review.findUnique({
        where: {
          userId_mediaId: {
            userId,
            mediaId: media.id,
          },
        },
        select: { id: true },
      })

      if (existing) {
        await this.markRow(row.id, ImportRowStatus.SKIPPED_EXISTING)
        return
      }

      try {
        await this.prisma.$transaction(async (tx) => {
          await tx.review.create({
            data: {
              userId,
              mediaId: media.id,
              rating: row.rating!,
              content: null,
              createdAt: row.ratedAt ?? undefined,
            },
          })

          await tx.plannedItem.deleteMany({
            where: {
              userId,
              mediaId: media.id,
            },
          })
        })
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          await this.markRow(row.id, ImportRowStatus.SKIPPED_EXISTING)
          return
        }

        throw error
      }

      await this.markRow(row.id, ImportRowStatus.CREATED)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.logger.warn(`Import row ${row.imdbId} failed: ${message}`)
      await this.markRow(row.id, ImportRowStatus.ERROR, message)
    }
  }

  private async resolveMedia(
    imdbId: string,
    preferredType: MediaType,
    fallbackTitle: string,
    mediaByImdbId: Map<string, Media>,
  ): Promise<Media | null> {
    const cached = mediaByImdbId.get(imdbId)
    if (cached) {
      return cached
    }

    const existing = await this.mediaService.findByImdbId(imdbId)
    if (existing) {
      mediaByImdbId.set(imdbId, existing)
      return existing
    }

    const match = await this.tmdbFind.findByImdbId(imdbId, preferredType)
    if (!match) {
      return null
    }

    const byExternalId = await this.mediaService.findByExternalId(match.mediaType, match.externalId)
    if (byExternalId) {
      const linked = await this.attachImdbId(byExternalId, imdbId)
      mediaByImdbId.set(imdbId, linked)
      return linked
    }

    try {
      const created = await this.prisma.media.create({
        data: {
          externalId: match.externalId,
          mediaType: match.mediaType,
          title: match.title || fallbackTitle,
          posterUrl: match.posterUrl,
          metadata: { imdbId },
          imdbId,
        },
      })

      mediaByImdbId.set(imdbId, created)
      return created
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const raced =
          (await this.mediaService.findByImdbId(imdbId)) ??
          (await this.mediaService.findByExternalId(match.mediaType, match.externalId))
        if (raced) {
          const linked = await this.attachImdbId(raced, imdbId)
          mediaByImdbId.set(imdbId, linked)
          return linked
        }
      }

      throw error
    }
  }

  private async attachImdbId(media: Media, imdbId: string): Promise<Media> {
    if (media.imdbId === imdbId) {
      return media
    }

    const current =
      media.metadata && typeof media.metadata === 'object' && !Array.isArray(media.metadata)
        ? (media.metadata as Record<string, unknown>)
        : {}

    return this.prisma.media.update({
      where: { id: media.id },
      data: {
        imdbId,
        metadata: { ...current, imdbId },
      },
    })
  }

  private markRow(id: string, status: ImportRowStatus, error?: string | null) {
    return this.prisma.importJobRow.update({
      where: { id },
      data: {
        status,
        error: error ?? null,
      },
    })
  }

  private async syncCounters(importJobId: string): Promise<void> {
    const groups = await this.prisma.importJobRow.groupBy({
      by: ['status'],
      where: { jobId: importJobId },
      _count: true,
    })

    const count = (status: ImportRowStatus) =>
      groups.find((group) => group.status === status)?._count ?? 0

    const created = count(ImportRowStatus.CREATED)
    const skippedExisting = count(ImportRowStatus.SKIPPED_EXISTING)
    const skippedType = count(ImportRowStatus.SKIPPED_TYPE)
    const notFound = count(ImportRowStatus.NOT_FOUND)
    const invalid = count(ImportRowStatus.INVALID)
    const errorCount = count(ImportRowStatus.ERROR)

    await this.prisma.importJob.update({
      where: { id: importJobId },
      data: {
        createdCount: created,
        skippedExisting,
        skippedType,
        notFound,
        invalid,
        errorCount,
        processed: created + skippedExisting + skippedType + notFound + invalid + errorCount,
      },
    })
  }

  private async finalize(
    importJobId: string,
    status: ImportJobStatus,
    errorMessage?: string,
  ): Promise<void> {
    await this.syncCounters(importJobId)
    await this.prisma.importJob.update({
      where: { id: importJobId },
      data: {
        status,
        errorMessage: errorMessage ?? null,
        finishedAt: new Date(),
      },
    })
  }
}
