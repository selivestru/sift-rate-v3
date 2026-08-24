import { useMutation, useQueryClient } from '@tanstack/react-query'

import { removeNotificationFromCache } from '~/modules/notifications/utils/remove-notification-from-cache'

import { followApi } from '../api/follow.api'
import { removeFollowRequestFromCache } from '../utils/update-follow-requests-cache'

interface AcceptFollowRequestVariables {
  followerId: string
  notificationId: string | null
}

export const useAcceptFollowRequestMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['accept-follow-request'],
    mutationFn: ({ followerId }: AcceptFollowRequestVariables) =>
      followApi.acceptFollowRequest(followerId),
    onSuccess: (_, { followerId, notificationId }) => {
      removeFollowRequestFromCache(queryClient, followerId)

      if (notificationId) {
        removeNotificationFromCache(queryClient, notificationId)
      }
    },
  })
}
