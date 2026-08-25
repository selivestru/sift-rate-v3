import { api } from '~/common/api'

export const userApi = {
  changeDisplayName: (displayName: string) => {
    return api
      .patch<{ displayName: string }>('/user/display-name', {
        json: { displayName },
      })
      .json()
  },
  changeUsername: (username: string) => {
    return api.patch<{ username: string }>('/user/username', { json: { username } }).json()
  },
  deleteAccount: () => {
    return api.post('/user/delete', { json: {} })
  },
}
