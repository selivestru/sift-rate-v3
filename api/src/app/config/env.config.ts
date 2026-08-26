import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  ORIGIN: z.url(),

  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),

  SESSION_SECRET: z.string().min(32),
  SESSION_PREFIX: z.string().min(1).default('sessions:'),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.url(),

  TMDB_API_KEY: z.string(),
  OMDB_API_KEY: z.string(),
  IGDB_CLIENT_ID: z.string(),
  IGDB_CLIENT_SECRET: z.string(),
  GOOGLE_BOOKS_API_KEY: z.string(),
  SERPER_API_KEY: z.string(),

  SPOTIFY_CLIENT_ID: z.string().min(1),
  SPOTIFY_CLIENT_SECRET: z.string().min(1),

  S3_ENDPOINT: z.url(),
  S3_BUCKET: z.string().min(1),
  S3_REGION: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),

  S3_PUBLIC_BASE_URL: z.url(),
})

export type EnvConfig = z.infer<typeof envSchema>

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  return envSchema.parse(config)
}
