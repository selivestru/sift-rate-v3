import { registerAs } from '@nestjs/config'

import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  ORIGIN: z.url(),

  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),

  TMDB_API_KEY: z.string(),
  IGDB_CLIENT_ID: z.string(),
  IGDB_CLIENT_SECRET: z.string(),
  GOOGLE_BOOKS_API_KEY: z.string(),
})

export type EnvConfig = z.infer<typeof envSchema>

export default registerAs('app', () => {
  envSchema.parse(process.env)

  return {}
})
