import z from 'zod'

export const displayNameSchema = z
  .string()
  .trim()
  .min(2, 'Display name is required')
  .max(50, 'Display name must be at most 50 characters')
