import { z } from 'zod'

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/
const PASSWORD_LOWER = /[a-z]/
const PASSWORD_UPPER = /[A-Z]/
const PASSWORD_DIGIT = /\d/
const PASSWORD_SPECIAL = /[^A-Za-z0-9]/

export const emailSchema = z
  .email()
  .trim()
  .min(1, 'Email is required')
  .max(254, 'Email must be at most 254 characters')
  .toLowerCase()

export const usernameSchema = z
  .string()
  .trim()
  .min(4, 'Username must be at least 4 characters')
  .max(25, 'Username must be at most 25 characters')
  .regex(USERNAME_REGEX, 'Username can only contain letters, numbers, and underscores')

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

export const loginPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .max(64, 'Password must be at most 64 characters')

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
})

export const registerSchema = z
  .object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
