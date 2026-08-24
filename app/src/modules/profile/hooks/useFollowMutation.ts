import { useMutation } from '@tanstack/react-query'

import { useAuthStore } from '~/modules/auth'

import { followApi } from '../api/follow.api'
import {
  updateProfileFollowInCache,
  updateProfileFollowingInCache,
} from '../utils/update-follow-requests-cache'

export const useFollowMutation = (username: string) => {
  return useMutation({
    mutationKey: ['follow-user'],
    mutationFn: followApi.follow,
    onSuccess: (data, _, __, context) => {
      updateProfileFollowInCache(context.client, username, data.followStatus, 1)

      const me = useAuthStore.getState().user

      if (!me || !me.username) return

      updateProfileFollowingInCache(context.client, me.username, 'NONE', 1)
    },
  })
}
