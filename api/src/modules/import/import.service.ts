import { InjectQueue } from '@nestjs/bullmq'
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'

import { IMDB_IMPORT_MAX_FILE_BYTES } from './constants/imdb-import'
import { IMDB_IMPORT_JOB, IMDB_IMPORT_QUEUE, ImdbImportJobData } from './constants/import-queue'
import {
  ImdbImportRowInput,
  ImportHistoryResponse,
  ImportJobResponse,
  ImportRowsResponse,
} from './types/import.types'
import { parseImdbCsv } from './utils/parse-imdb-csv'
import { Queue } from 'bullmq'
import { DEFAULT_PAGE_SIZE } from '~/common/constants/pagination'
import { ImportJob } from '~/generated/prisma/client'
import { ImportJobStatus, ImportRowStatus, ImportSource } from '~/generated/prisma/enums'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

const ACTIVE_STATUSES: ImportJobStatus[] = [ImportJobStatus.PENDING, ImportJobStatus.PROCESSING]

const RETRYABLE_STATUSES: ImportRowStatus[] = [
  ImportRowStatus.PENDING,
  ImportRowStatus.NOT_FOUND,
  ImportRowStatus.ERROR,
  ImportRowStatus.SKIPPED_TYPE,
]

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name)

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(IMDB_IMPORT_QUEUE)
    private readonly importQueue: Queue<ImdbImportJobData>,
  ) {}

  async createImdbImport(userId: string, file?: Express.Multer.File): Promise<ImportJobResponse> {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    if (file.size > IMDB_IMPORT_MAX_FILE_BYTES) {
      throw new BadRequestException('File exceeds the 5MB limit')
    }

    const isCsv =
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/octet-stream' ||
      file.originalname.toLowerCase().endsWith('.csv')

    if (!isCsv) {
      throw new BadRequestException('File must be a CSV export from IMDb')
    }

    let rows: ImdbImportRowInput[]
    try {
      rows = parseImdbCsv(file.buffer.toString('utf8'))
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Invalid CSV')
    }

    const job = await this.prisma.$transaction(async (tx) => {
      const active = await tx.importJob.findFirst({
        where: {
          userId,
          status: { in: ACTIVE_STATUSES },
        },
        select: { id: true },
      })

      if (active) {
        throw new ConflictException('An import is already in progress')
      }

      return tx.importJob.create({
        data: {
          userId,
          source: ImportSource.IMDB,
          status: ImportJobStatus.PENDING,
          total: rows.length,
          rows: {
            create: rows.map((row, position) => ({
              position,
              imdbId: row.imdbId,
              rating: row.rating,
              ratedAt: row.ratedAt,
              title: row.title,
              titleType: row.titleType,
              status: row.status,
              error: row.error,
            })),
          },
        },
      })
    })

    await this.enqueue(job.id)

    return this.getJob(userId, job.id)
  }

  async getActiveJob(userId: string): Promise<ImportJobResponse | null> {
    const job = await this.prisma.importJob.findFirst({
      where: {
        userId,
        status: { in: ACTIVE_STATUSES },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!job) {
      return null
    }

    return this.toResponse(job)
  }

  async getJob(userId: string, jobId: string): Promise<ImportJobResponse> {
    const job = await this.requireOwnedJob(userId, jobId)
    return this.toResponse(job)
  }

  async getHistory(userId: string, cursor?: string): Promise<ImportHistoryResponse> {
    const jobs = await this.prisma.importJob.findMany({
      where: {
        userId,
        source: ImportSource.IMDB,
      },
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: DEFAULT_PAGE_SIZE + 1,
    })

    const hasNextPage = jobs.length > DEFAULT_PAGE_SIZE
    if (hasNextPage) jobs.pop()

    return {
      data: jobs.map((job) => this.toSummary(job)),
      nextCursor: hasNextPage ? jobs[jobs.length - 1].id : null,
    }
  }

  async getRows(
    userId: string,
    jobId: string,
    cursor?: string,
    status?: ImportRowStatus,
  ): Promise<ImportRowsResponse> {
    await this.requireOwnedJob(userId, jobId)

    const rows = await this.prisma.importJobRow.findMany({
      where: {
        jobId,
        ...(status && { status }),
      },
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
      take: DEFAULT_PAGE_SIZE + 1,
    })

    const hasNextPage = rows.length > DEFAULT_PAGE_SIZE
    if (hasNextPage) rows.pop()

    return {
      data: rows.map((row) => ({
        id: row.id,
        position: row.position,
        imdbId: row.imdbId,
        rating: row.rating,
        ratedAt: row.ratedAt,
        title: row.title,
        titleType: row.titleType,
        status: row.status,
        error: row.error,
      })),
      nextCursor: hasNextPage ? rows[rows.length - 1].id : null,
    }
  }

  async retryJob(userId: string, jobId: string): Promise<ImportJobResponse> {
    const job = await this.requireOwnedJob(userId, jobId)

    if (ACTIVE_STATUSES.includes(job.status)) {
      throw new ConflictException('Import is already in progress')
    }

    const retryable = await this.prisma.importJobRow.count({
      where: {
        jobId: job.id,
        status: { in: RETRYABLE_STATUSES },
      },
    })

    if (retryable === 0) {
      throw new BadRequestException('Nothing left to retry')
    }

    await this.prisma.$transaction(async (tx) => {
      const active = await tx.importJob.findFirst({
        where: {
          userId,
          status: { in: ACTIVE_STATUSES },
          NOT: { id: job.id },
        },
        select: { id: true },
      })

      if (active) {
        throw new ConflictException('An import is already in progress')
      }

      await tx.importJob.update({
        where: { id: job.id },
        data: {
          status: ImportJobStatus.PENDING,
          errorMessage: null,
          finishedAt: null,
        },
      })
    })

    await this.enqueue(job.id)

    return this.getJob(userId, job.id)
  }

  private async enqueue(importJobId: string): Promise<void> {
    const jobId = `imdb-import-${importJobId}`

    try {
      await this.importQueue.remove(jobId)
    } catch {
      // ignore
    }

    try {
      await this.importQueue.add(
        IMDB_IMPORT_JOB,
        { importJobId },
        {
          jobId,
          attempts: 1,
          removeOnComplete: true,
          removeOnFail: true,
        },
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (message.includes('Job is already') || message.includes('already exists')) {
        return
      }

      this.logger.error(`Failed to enqueue import ${importJobId}: ${message}`)
      await this.prisma.importJob.update({
        where: { id: importJobId },
        data: {
          status: ImportJobStatus.FAILED,
          errorMessage: 'Failed to enqueue import',
          finishedAt: new Date(),
        },
      })
      throw error
    }
  }

  private async requireOwnedJob(userId: string, jobId: string): Promise<ImportJob> {
    const job = await this.prisma.importJob.findFirst({
      where: { id: jobId, userId },
    })

    if (!job) {
      throw new NotFoundException('Import job not found')
    }

    return job
  }

  private toResponse(job: ImportJob): ImportJobResponse {
    return this.toSummary(job)
  }

  private toSummary(job: ImportJob) {
    return {
      id: job.id,
      status: job.status,
      total: job.total,
      processed: job.processed,
      created: job.createdCount,
      skippedExisting: job.skippedExisting,
      skippedType: job.skippedType,
      notFound: job.notFound,
      invalid: job.invalid,
      errorCount: job.errorCount,
      errorMessage: job.errorMessage,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      finishedAt: job.finishedAt,
    }
  }
}
