import { useMutation } from '@tanstack/react-query'

import { userApi } from '../api/user.api'

export const useChangeDisplayNameMutation = () => {
  return useMutation({
    mutationKey: ['change-display-name'],
    mutationFn: userApi.changeDisplayName,
  })
}
