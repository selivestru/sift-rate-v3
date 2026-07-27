import z from 'zod'

import { displayNameSchema, emailSchema, passwordSchema, usernameSchema } from '~/modules/user'

export const loginPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .max(64, 'Password must be at most 64 characters')

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
  twoFactorCode: z
    .string()
    .min(6, 'Two-factor code is required')
    .max(6, 'Two-factor code must be 6 digits')
    .optional(),
})

export const registerSchema = z
  .object({
    email: emailSchema,
    username: usernameSchema,
    displayName: displayNameSchema,
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
