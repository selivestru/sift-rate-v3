import { z } from 'zod'

const TWO_FACTOR_CODE_REGEX = /^\d{6}$/
const TWO_FACTOR_CODE_MESSAGE = 'Enter the 6-digit code from your authenticator app'

export const twoFactorCodeSchema = z
  .string()
  .trim()
  .min(1, 'Verification code is required')
  .regex(TWO_FACTOR_CODE_REGEX, TWO_FACTOR_CODE_MESSAGE)

export const optionalTwoFactorCodeSchema = z
  .string()
  .trim()
  .refine((value) => value === '' || TWO_FACTOR_CODE_REGEX.test(value), {
    message: TWO_FACTOR_CODE_MESSAGE,
  })
  .optional()

export const twoFactorCodeFormSchema = z.object({
  code: twoFactorCodeSchema,
})

export type TwoFactorCodeInput = z.infer<typeof twoFactorCodeSchema>
export type TwoFactorCodeFormInput = z.infer<typeof twoFactorCodeFormSchema>
