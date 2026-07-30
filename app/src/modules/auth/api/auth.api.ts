import { api } from '~/common/api'

import type { ForgotPasswordInput, LoginInput, RegisterInput } from '../schema/auth.schema'
import type {
  ForgotPasswordResponse,
  LoginResponse,
  RegisterResponse,
  ResendVerificationResponse,
  ResetPasswordResponse,
} from '../types/auth.type'

export const authApi = {
  login: (body: LoginInput) => {
    return api.post<LoginResponse>('/auth/login', { json: body }).json()
  },
  register: (body: RegisterInput) => {
    const { confirmPassword: _, ...payload } = body
    return api.post<RegisterResponse>('/auth/register', { json: payload }).json()
  },
  forgotPassword: (body: ForgotPasswordInput) => {
    return api.post<ForgotPasswordResponse>('/auth/forgot-password', { json: body }).json()
  },
  resendVerification: (body: { email: string }) => {
    return api.post<ResendVerificationResponse>('/auth/resend-verification', { json: body }).json()
  },
  resetPasswordVerify: (token: string) => {
    return api.post<void>('/auth/reset-password/verify', { json: { token } })
  },
  resetPassword: (body: { token: string; password: string }) => {
    return api.post<ResetPasswordResponse>('/auth/reset-password', { json: body }).json()
  },
  getGoogleUrl: () => {
    return api.get<{ url: string }>('/auth/google/url').json()
  },
  me: () => {
    return api.get<LoginResponse>('/auth/me').json()
  },
  logout: () => {
    return api.post('/auth/logout')
  },
}
