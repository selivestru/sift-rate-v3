import { BadRequestException } from '@nestjs/common'

export type ReviewCursorPayload = {
  /** ISO timestamp of `updatedAt` */
  u: string
  /** Review id */
  i: string
}

export function encodeReviewCursor(updatedAt: Date, id: string): string {
  const payload: ReviewCursorPayload = {
    u: updatedAt.toISOString(),
    i: id,
  }
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
}

export function decodeReviewCursor(cursor: string): { updatedAt: Date; id: string } {
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf8')
    const parsed = JSON.parse(raw) as Partial<ReviewCursorPayload>

    if (typeof parsed.u !== 'string' || typeof parsed.i !== 'string' || !parsed.i) {
      throw new Error('Invalid cursor shape')
    }

    const updatedAt = new Date(parsed.u)
    if (Number.isNaN(updatedAt.getTime())) {
      throw new Error('Invalid cursor date')
    }

    return { updatedAt, id: parsed.i }
  } catch {
    throw new BadRequestException('Invalid cursor')
  }
}
