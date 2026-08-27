import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { readFile } from 'node:fs/promises'
import { AppModule } from '~/app.module'
import { MediaType } from '~/generated/prisma/enums'
import { ReviewService } from '~/modules/review/review.service'

interface LegacyReview {
  rating: number
  review: string
  title: string
  type: string
  externalId: string
  createdAt: string
}

const REQUEST_DELAY_MS = 300

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

const resolveMediaType = (type: string): MediaType => {
  if (type === 'TV') return MediaType.TV_SHOW
  return MediaType.MOVIE
}

async function main(): Promise<void> {
  const logger = new Logger('ImportReviews')

  const userId = process.env['IMPORT_USER_ID']
  const file = process.env['IMPORT_FILE'] ?? 'reviews.json'

  if (!userId) {
    throw new Error('IMPORT_USER_ID is required')
  }

  const app = await NestFactory.createApplicationContext(AppModule)
  const reviewService = app.get(ReviewService)

  const raw = await readFile(file, 'utf8')
  const items = JSON.parse(raw) as LegacyReview[]

  logger.log(`Importing ${items.length} reviews for user ${userId}`)

  let ok = 0
  let failed = 0

  for (const [index, item] of items.entries()) {
    const label = `${index + 1}/${items.length} ${item.title} (${item.externalId})`

    try {
      await reviewService.upsertReview(
        userId,
        {
          mediaType: resolveMediaType(item.type),
          externalId: item.externalId,
          rating: item.rating,
          content: item.review,
        },
        item.createdAt,
      )
      ok += 1
      logger.log(`[ok] ${label}`)
    } catch (error) {
      failed += 1
      logger.error(`[failed] ${label}: ${error instanceof Error ? error.message : String(error)}`)
    }

    await sleep(REQUEST_DELAY_MS)
  }

  logger.log(`Done: ok=${ok} failed=${failed} total=${items.length}`)

  await app.close()

  if (failed > 0) {
    process.exitCode = 1
  }
}

main().catch((error: unknown) => {
  new Logger('ImportReviews').error(
    `Fatal: ${error instanceof Error ? error.stack : String(error)}`,
  )
  process.exitCode = 1
})
