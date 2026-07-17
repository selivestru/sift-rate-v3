import { api } from '~/common/api'

import type { ForgotPasswordInput, LoginInput, RegisterInput } from '../schema/auth.schema'
import type { LoginResponse } from '../types/auth.type'

export const authApi = {
  login: (body: LoginInput) => {
    return api.post<LoginResponse>('/auth/login', { json: body }).json()
  },
  register: (body: RegisterInput) => {
    const { confirmPassword: _, ...payload } = body
    return api.post<LoginResponse>('/auth/register', { json: payload }).json()
  },
  forgotPassword: (body: ForgotPasswordInput) => {
    return api.post('/auth/forgot-password', { json: body }).json()
  },
}
