import { api } from '~/common/api'

export const userApi = {
  changeAvatar: (file: File) => {
    const body = new FormData()
    body.append('file', file)
    return api.patch<{ avatarUrl: string }>('/user/avatar', { body }).json()
  },
  changeUsername: (username: string) => {
    return api.patch<{ username: string }>('/user/username', { json: { username } }).json()
  },
  deleteAccount: () => {
    return api.post('/user/delete', { json: {} })
  },
}
