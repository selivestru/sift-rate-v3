import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
})

export const registerSchema = z.object({
  email: z.email(),
  username: z.string(),
  password: z.string(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
