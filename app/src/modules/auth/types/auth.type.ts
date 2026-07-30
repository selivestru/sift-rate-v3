import type { User } from './user.type'

export interface LoginResponse {
  user: User
}

export interface RegisterResponse {
  message: string
}

export interface ForgotPasswordResponse {
  message: string
  ttl: number
}

export interface ResendVerificationResponse {
  message: string
  ttl: number
}

export interface ResetPasswordResponse {}
