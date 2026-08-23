import { useMutation } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import { followApi } from '../api/follow.api'
import type { Profile } from '../types/profile.types'

export const useFollowMutation = (username: string) => {
  return useMutation({
    mutationKey: ['follow-user'],
    mutationFn: followApi.follow,
    onSuccess: (data, _, __, context) => {
      context.client.setQueryData<Profile>(QUERIES_KEYS.profile(username), (prev) => {
        if (!prev) return prev

        return {
          ...prev,
          followStatus: data.followStatus,
          followersCount: prev.followersCount + 1,
        }
      })
    },
  })
}
