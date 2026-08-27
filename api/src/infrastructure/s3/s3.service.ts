import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { EnvConfig } from '~/app/config/env.config'

@Injectable()
export class S3Service {
  private readonly client: S3Client
  private readonly bucket: string
  private readonly publicBaseUrl: string

  constructor(private readonly config: ConfigService<EnvConfig, true>) {
    this.bucket = this.config.get('S3_BUCKET', { infer: true })
    this.publicBaseUrl = this.config.get('S3_PUBLIC_BASE_URL', { infer: true })

    const endpoint = this.config.get('S3_ENDPOINT', { infer: true })

    this.client = new S3Client({
      endpoint,
      region: this.config.get('S3_REGION', { infer: true }),
      credentials: {
        accessKeyId: this.config.get('S3_ACCESS_KEY_ID', { infer: true }),
        secretAccessKey: this.config.get('S3_SECRET_ACCESS_KEY', { infer: true }),
      },
      forcePathStyle: !!endpoint,
    })
  }

  buildPublicUrl(key: string): string {
    const normalizedKey = key.replace(/^\/+/, '')
    return `${this.publicBaseUrl}/${normalizedKey}`
  }

  extractOwnedKey(url: string): string | null {
    try {
      const parsed = new URL(url)
      const base = new URL(this.publicBaseUrl)

      if (parsed.host !== base.host) {
        return null
      }

      const basePath = base.pathname.replace(/\/+$/, '')
      const pathname = parsed.pathname

      if (basePath) {
        if (pathname === basePath) {
          return null
        }

        if (!pathname.startsWith(`${basePath}/`)) {
          return null
        }

        return pathname.slice(basePath.length + 1) || null
      }

      return pathname.replace(/^\/+/, '') || null
    } catch {
      return null
    }
  }

  async putObject(params: { key: string; body: Buffer; contentType: string }): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType,
      }),
    )
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    )
  }
}
