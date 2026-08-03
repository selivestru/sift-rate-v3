import { useMutation } from '@tanstack/react-query'

import { userApi } from '~/modules/user'

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationKey: ['change-password'],
    mutationFn: userApi.changePassword,
  })
}
