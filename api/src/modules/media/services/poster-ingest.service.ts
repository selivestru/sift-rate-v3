import { Injectable, Logger } from '@nestjs/common'

import ky from 'ky'
import sharp from 'sharp'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
import { S3Service } from '~/infrastructure/s3/s3.service'

const FETCH_TIMEOUT_MS = 15_000
const MAX_IMAGE_BYTES = 10 * 1024 * 1024

@Injectable()
export class PosterIngestService {
  private readonly logger = new Logger(PosterIngestService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async ingest(mediaId: string, sourcePosterUrl: string): Promise<void> {
    const media = await this.prisma.media.findUnique({ where: { id: mediaId } })

    if (!media) {
      this.logger.warn(`Poster ingest skipped: media ${mediaId} not found`)
      return
    }

    const fetchUrl = media.posterUrl ?? sourcePosterUrl

    if (this.s3.isOwnedUrl(fetchUrl)) {
      return
    }

    const buffer = await this.downloadImage(fetchUrl)

    const optimized = await sharp(buffer)
      .rotate()
      .resize({
        width: 600,
        height: 600,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 100 })
      .toBuffer()

    const s3Id = crypto.randomUUID().replace(/-/g, '')
    const key = `media-covers/${s3Id}.webp`

    await this.s3.putObject({
      key,
      body: optimized,
      contentType: 'image/webp',
    })

    const ownedUrl = this.s3.buildPublicUrl(key)

    await this.prisma.media.update({
      where: {
        id: mediaId,
        posterUrl: media.posterUrl,
      },
      data: { posterUrl: ownedUrl },
    })

    this.logger.log(`Poster ingest completed for media ${mediaId} → ${ownedUrl}`)
  }

  private async downloadImage(url: string): Promise<Buffer> {
    let parsed: URL

    try {
      parsed = new URL(url)
    } catch {
      throw new Error(`Invalid poster URL: ${url}`)
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error(`Unsupported poster URL protocol: ${parsed.protocol}`)
    }

    const response = await ky(url, {
      timeout: FETCH_TIMEOUT_MS,
      headers: {
        Accept: 'image/*,*/*;q=0.8',
      },
      hooks: {
        afterResponse: [
          ({ response }) => {
            const contentLength = response.headers.get('content-length')

            if (contentLength && Number(contentLength) > MAX_IMAGE_BYTES) {
              throw new Error(`Poster too large: content-length ${contentLength}`)
            }

            const contentType = response.headers.get('content-type')

            if (!contentType?.startsWith('image/')) {
              throw new Error(`Unexpected content type: ${contentType}`)
            }
          },
        ],
      },
    })

    const arrayBuffer = await response.arrayBuffer()

    if (arrayBuffer.byteLength > MAX_IMAGE_BYTES) {
      throw new Error(`Poster too large: ${arrayBuffer.byteLength} bytes`)
    }

    return Buffer.from(arrayBuffer)
  }
}
