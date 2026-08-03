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
  changePassword: (data: {
    currentPassword: string
    newPassword: string
    twoFactorCode?: string
  }) => {
    return api.patch<{ message: string }>('/user/password', { json: data }).json()
  },
  changeEmail: (data: { newEmail: string; currentPassword: string; twoFactorCode?: string }) => {
    return api.patch<{ message: string }>('/user/email', { json: data }).json()
  },
  deleteAccount: (data: { password?: string; twoFactorCode?: string }) => {
    return api.post<{ message: string }>('/user/delete', { json: data }).json()
  },
}
