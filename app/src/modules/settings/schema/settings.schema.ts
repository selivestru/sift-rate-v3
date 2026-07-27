import z from 'zod'

import { emailSchema, passwordSchema } from '~/modules/user'

export const changeEmailSchema = z.object({
  email: emailSchema,
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })

export const twoFactorCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Verification code is required')
    .regex(/^\d{6}$/, 'Enter the 6-digit code from your authenticator app'),
})

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type TwoFactorCodeInput = z.infer<typeof twoFactorCodeSchema>
