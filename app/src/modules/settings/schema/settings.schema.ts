import { z } from 'zod'

import { emailSchema, optionalTwoFactorCodeSchema, passwordSchema } from '~/modules/user'

export const changeEmailSchema = z.object({
  newEmail: emailSchema,
  currentPassword: z.string().min(1, 'Current password is required'),
  twoFactorCode: optionalTwoFactorCodeSchema,
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
    twoFactorCode: optionalTwoFactorCodeSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })

export const createDeleteAccountSchema = (requirePassword: boolean) =>
  z.object({
    password: requirePassword
      ? z.string().trim().min(1, 'Password is required')
      : z.string().trim().optional(),
    twoFactorCode: optionalTwoFactorCodeSchema,
  })

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type DeleteAccountInput = z.infer<ReturnType<typeof createDeleteAccountSchema>>
