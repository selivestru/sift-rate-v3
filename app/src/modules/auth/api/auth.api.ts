import { api } from '~/common/api'

import type { LoginInput } from '../schema/auth.schema'
import type { LoginResponse } from '../types/auth.type'

export const authApi = {
  login: (body: LoginInput) => {
    return api.post<LoginResponse>('/auth/login', { json: body }).json()
  },
  register: (body: LoginInput) => {
    return api.post<LoginResponse>('/auth/register', { json: body }).json()
  },
}
