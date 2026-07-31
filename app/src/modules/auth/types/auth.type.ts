import type { User } from './user.type'

export interface LoginResponse {
  user: User
}

export interface RegisterResponse {
  message: string
}

export interface ForgotPasswordResponse {
  message: string
  retryAfter: number
}

export interface ResendVerificationResponse {
  message: string
  retryAfter: number
}

export interface ResetPasswordResponse {
  message: string
}

export interface CompleteProfileResponse {
  displayName: string
  username: string
}
