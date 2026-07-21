import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { EnvConfig } from '~/app/config/env.config'

@Injectable()
export class S3Service {
  private readonly client: S3Client
  private readonly bucket: string
  private readonly publicBaseUrl: string
  private readonly ownedHost: string

  constructor(private readonly config: ConfigService<EnvConfig, true>) {
    this.bucket = this.config.get('S3_BUCKET', { infer: true })
    this.publicBaseUrl = this.config.get('S3_PUBLIC_BASE_URL', { infer: true })
    this.ownedHost = new URL(this.publicBaseUrl).host

    this.client = new S3Client({
      region: this.config.get('S3_REGION', { infer: true }),
      credentials: {
        accessKeyId: this.config.get('S3_ACCESS_KEY_ID', { infer: true }),
        secretAccessKey: this.config.get('S3_SECRET_ACCESS_KEY', { infer: true }),
      },
    })
  }

  isOwnedUrl(url: string): boolean {
    try {
      return new URL(url).host === this.ownedHost
    } catch {
      return false
    }
  }

  buildPublicUrl(key: string): string {
    const normalizedKey = key.replace(/^\/+/, '')
    return `${this.publicBaseUrl}/${normalizedKey}`
  }

  async putObject(params: {
    key: string
    body: Buffer
    contentType: string
    cacheControl?: string
  }): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType,
        CacheControl: params.cacheControl ?? 'public, max-age=31536000, immutable',
      }),
    )
  }
}
