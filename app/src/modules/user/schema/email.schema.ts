import z from 'zod'

export const emailSchema = z
  .email()
  .trim()
  .min(1, 'Email is required')
  .max(254, 'Email must be at most 254 characters')
  .toLowerCase()
