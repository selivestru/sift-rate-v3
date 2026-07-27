import { api } from '~/common/api'
import type { LoginResponse } from '~/modules/auth/types/auth.type'

export const userApi = {
  changeUsername: (username: string) => {
    return api.put<LoginResponse>('/user/username', { json: { username } }).json()
  },
}
