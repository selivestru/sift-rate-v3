import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'

import { EMAIL_QUEUE, WELCOME_GOOGLE_JOB, WELCOME_JOB } from './constants/email-queue'
import { ResendService } from './resend.service'
import { Job } from 'bullmq'

@Processor(EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name)

  constructor(private readonly resend: ResendService) {
    super()
  }

  async process(job: Job<{ to: string; token?: string }>) {
    if (job.name === WELCOME_JOB) {
      await this.resend.sendWelcomeEmail(job.data.to, job.data.token!)
    } else if (job.name === WELCOME_GOOGLE_JOB) {
      await this.resend.sendGoogleWelcomeEmail(job.data.to)
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.warn(
      { jobId: job.id, jobName: job.name, attemptsMade: job.attemptsMade },
      `Email job failed: ${error.message}`,
    )
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log({ jobId: job.id, jobName: job.name }, 'Email sent')
  }
}
