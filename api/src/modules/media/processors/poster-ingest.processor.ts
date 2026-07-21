import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'

import {
  POSTER_INGEST_JOB,
  POSTER_INGEST_QUEUE,
  PosterIngestJobData,
} from '../constants/poster-queue'
import { PosterIngestService } from '../services/poster-ingest.service'
import { Job } from 'bullmq'

@Processor(POSTER_INGEST_QUEUE)
export class PosterIngestProcessor extends WorkerHost {
  private readonly logger = new Logger(PosterIngestProcessor.name)

  constructor(private readonly posterIngest: PosterIngestService) {
    super()
  }

  async process(job: Job<PosterIngestJobData>): Promise<void> {
    if (job.name !== POSTER_INGEST_JOB) {
      this.logger.warn(`Unknown job name on ${POSTER_INGEST_QUEUE}: ${job.name}`)
      return
    }

    const { mediaId, sourcePosterUrl } = job.data

    this.logger.debug(`Processing poster ingest job ${job.id} for media ${mediaId}`)

    await this.posterIngest.ingest(mediaId, sourcePosterUrl)
  }
}
