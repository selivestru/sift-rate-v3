import { toastApiError } from '~/common/api'

import { useLikePostMutation } from './useLikePostMutation'
import { useUnLikePostMutation } from './useUnLikePostMutation'

export const useToggleLikePost = (postId: string, isLiked: boolean) => {
  const likeMutation = useLikePostMutation()
  const unlikeMutation = useUnLikePostMutation()

  const isPending = likeMutation.isPending || unlikeMutation.isPending

  const toggleLike = async () => {
    if (isPending) return

    const { mutateAsync } = isLiked ? unlikeMutation : likeMutation

    try {
      await mutateAsync(postId)
    } catch (error) {
      toastApiError(error)
    }
  }

  return {
    toggleLike,
    isPending,
  }
}
