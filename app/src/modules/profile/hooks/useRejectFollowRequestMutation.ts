import { useMutation, useQueryClient } from '@tanstack/react-query'

import { followApi } from '../api/follow.api'
import { removeFollowRequestFromCache } from '../utils/update-follow-requests-cache'

export const useRejectFollowRequestMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['reject-follow-request'],
    mutationFn: followApi.rejectFollowRequest,
    onSuccess: (_, followerId) => {
      removeFollowRequestFromCache(queryClient, followerId)
    },
  })
}
