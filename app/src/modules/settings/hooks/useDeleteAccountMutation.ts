import { useMutation } from '@tanstack/react-query'

import { userApi } from '~/modules/user'

export const useDeleteAccountMutation = () => {
  return useMutation({
    mutationKey: ['delete-account'],
    mutationFn: userApi.deleteAccount,
  })
}
