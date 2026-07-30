import { Matches, MaxLength, MinLength } from 'class-validator'
import {
  PASSWORD_DIGIT,
  PASSWORD_LOWER,
  PASSWORD_SPECIAL,
  PASSWORD_UPPER,
} from '~/modules/auth/constants/validation'

export function StrongPassword(): PropertyDecorator {
  const rules: PropertyDecorator[] = [
    MinLength(8, { message: 'Password must be at least 8 characters' }),
    MaxLength(64, { message: 'Password must be at most 64 characters' }),
    Matches(PASSWORD_LOWER, {
      message: 'Password must contain at least one lowercase letter',
    }),
    Matches(PASSWORD_UPPER, {
      message: 'Password must contain at least one uppercase letter',
    }),
    Matches(PASSWORD_DIGIT, {
      message: 'Password must contain at least one digit',
    }),
    Matches(PASSWORD_SPECIAL, {
      message: 'Password must contain at least one special character',
    }),
  ]

  return (target: object, propertyKey: string | symbol) => {
    for (const rule of rules) {
      rule(target, propertyKey)
    }
  }
}
