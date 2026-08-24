import { useMutation } from '@tanstack/react-query'

import { followApi } from '../api/follow.api'
import { updateProfileFollowInCache } from '../utils/update-follow-requests-cache'

export const useFollowMutation = (username: string) => {
  return useMutation({
    mutationKey: ['follow-user'],
    mutationFn: followApi.follow,
    onSuccess: (data, _, __, context) => {
      updateProfileFollowInCache(context.client, username, data.followStatus, 1)
    },
  })
}
