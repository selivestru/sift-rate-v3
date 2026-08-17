import { useToggleLikePost } from '../hooks/useToggleLikePost'
import { LikeButton } from './LikeButton'

interface LikePostButtonProps {
  postId: string
  parentId: string | null
  isLiked: boolean
  likesCount: number
}

export const LikePostButton = ({ postId, parentId, isLiked, likesCount }: LikePostButtonProps) => {
  const { toggleLike, isPending } = useToggleLikePost(postId, isLiked, parentId)

  return (
    <LikeButton
      isLiked={isLiked}
      likesCount={likesCount}
      onClick={toggleLike}
      isDisabled={isPending}
    />
  )
}
