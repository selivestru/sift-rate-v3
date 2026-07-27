import { api } from '~/common/api'

export const userApi = {
  changeUsername: (username: string) => {
    return api.put<{ username: string }>('/user/username', { json: { username } }).json()
  },
}
