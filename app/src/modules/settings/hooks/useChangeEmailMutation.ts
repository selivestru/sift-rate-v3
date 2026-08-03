import { useMutation } from '@tanstack/react-query'

import { userApi } from '~/modules/user'

export const useChangeEmailMutation = () => {
  return useMutation({
    mutationKey: ['change-email'],
    mutationFn: userApi.changeEmail,
  })
}
