import { useMutation } from '@tanstack/react-query'

import { followApi } from '../api/follow.api'
import { updateProfileFollowInCache } from '../utils/update-follow-requests-cache'

export const useUnfollowMutation = (username: string) => {
  return useMutation({
    mutationKey: ['unfollow-user'],
    mutationFn: followApi.unfollow,
    onSuccess: (data, _, __, context) => {
      updateProfileFollowInCache(context.client, username, data.followStatus, -1)
    },
  })
}
