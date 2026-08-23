import { useMutation, useQueryClient } from '@tanstack/react-query'

import { followApi } from '../api/follow.api'
import { removeFollowRequestFromCache } from '../utils/update-follow-requests-cache'

export const useAcceptFollowRequestMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['accept-follow-request'],
    mutationFn: followApi.acceptFollowRequest,
    onSuccess: (_, followerId) => {
      removeFollowRequestFromCache(queryClient, followerId)
    },
  })
}
