import z from 'zod'

const PASSWORD_LOWER = /[a-z]/
const PASSWORD_UPPER = /[A-Z]/
const PASSWORD_DIGIT = /\d/
const PASSWORD_SPECIAL = /[^A-Za-z0-9]/

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password must be at most 64 characters')
  .refine((value) => PASSWORD_LOWER.test(value), {
    message: 'Password must include a lowercase letter',
  })
  .refine((value) => PASSWORD_UPPER.test(value), {
    message: 'Password must include an uppercase letter',
  })
  .refine((value) => PASSWORD_DIGIT.test(value), {
    message: 'Password must include a number',
  })
  .refine((value) => PASSWORD_SPECIAL.test(value), {
    message: 'Password must include a special character',
  })
