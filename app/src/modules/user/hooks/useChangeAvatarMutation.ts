import { useMutation } from '@tanstack/react-query'

import { userApi } from '../api/user.api'

export const useChangeAvatarMutation = () => {
  return useMutation({
    mutationKey: ['change-avatar'],
    mutationFn: userApi.changeAvatar,
  })
}
