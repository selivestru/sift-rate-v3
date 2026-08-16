import { useToggleLikePost } from '../hooks/useToggleLikePost'
import { LikeButton } from './LikeButton'

interface LikePostButtonProps {
  postId: string
  isLiked: boolean
  likesCount: number
}

export const LikePostButton = ({ postId, isLiked, likesCount }: LikePostButtonProps) => {
  const { toggleLike, isPending } = useToggleLikePost(postId, isLiked)

  return (
    <LikeButton
      isLiked={isLiked}
      likesCount={likesCount}
      onClick={toggleLike}
      isDisabled={isPending}
    />
  )
}
