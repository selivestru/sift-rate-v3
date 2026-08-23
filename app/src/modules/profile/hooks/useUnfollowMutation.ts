import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { followApi } from '../api/follow.api'
import type { Profile } from '../types/profile.types'

export const useUnfollowMutation = (username: string) => {
  return useMutation({
    mutationKey: ['unfollow-user'],
    mutationFn: followApi.unfollow,
    onSuccess: (data, _, __, context) => {
      context.client.setQueryData<Profile>(QUERIES_KEYS.profile(username), (prev) => {
        if (!prev) return prev

        return {
          ...prev,
          followStatus: data.followStatus,
          followersCount: Math.max(0, prev.followersCount - 1),
        }
      })
    },
  })
}
