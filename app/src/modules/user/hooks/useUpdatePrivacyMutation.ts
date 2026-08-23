import { useMutation } from '@tanstack/react-query'

import { userApi } from '../api/user.api'

export const useUpdatePrivacyMutation = () => {
  return useMutation({
    mutationKey: ['update-privacy'],
    mutationFn: userApi.updatePrivacy,
  })
}
