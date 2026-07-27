import { useMutation } from '@tanstack/react-query'

import { userApi } from '../api/user.api'

export const useChangeUsernameMutation = () => {
  return useMutation({
    mutationKey: ['change-username'],
    mutationFn: userApi.changeUsername,
  })
}
