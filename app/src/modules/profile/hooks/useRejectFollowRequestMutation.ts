import { useMutation, useQueryClient } from '@tanstack/react-query'

import { removeNotificationFromCache } from '~/modules/notifications'

import { followApi } from '../api/follow.api'
import { removeFollowRequestFromCache } from '../utils/update-follow-requests-cache'

interface RejectFollowRequestVariables {
  followerId: string
  notificationId: string | null
}

export const useRejectFollowRequestMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['reject-follow-request'],
    mutationFn: ({ followerId }: RejectFollowRequestVariables) =>
      followApi.rejectFollowRequest(followerId),
    onSuccess: (_, { followerId, notificationId }) => {
      removeFollowRequestFromCache(queryClient, followerId)

      if (notificationId) {
        removeNotificationFromCache(queryClient, notificationId)
      }
    },
  })
}
