import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
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
}
