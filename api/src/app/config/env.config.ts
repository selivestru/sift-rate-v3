import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  ORIGIN: z.url(),

  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),

  SESSION_SECRET: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.url(),

  TMDB_API_KEY: z.string(),
  IGDB_CLIENT_ID: z.string(),
  IGDB_CLIENT_SECRET: z.string(),
  GOOGLE_BOOKS_API_KEY: z.string(),

  S3_BUCKET: z.string().min(1),
  S3_REGION: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),

  S3_PUBLIC_BASE_URL: z.url(),

  RESEND_API_KEY: z.string(),
})

export type EnvConfig = z.infer<typeof envSchema>

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  return envSchema.parse(config)
}
