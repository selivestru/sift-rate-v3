import { Heart } from 'reicon-react'
import { toast } from 'sonner'

import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'
import { formatCompactNumber } from '~/common/utils/formatCompactNumber'
import { useAuthStore } from '~/modules/auth'

interface LikeButtonProps {
  isLiked: boolean
  likesCount: number
  onClick: () => void
  isDisabled?: boolean
}

export const LikeButton = ({ isLiked, likesCount, onClick, isDisabled }: LikeButtonProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to like posts')
      return
    }

    onClick()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      startIcon={<Heart className="size-5" weight={isLiked ? 'Filled' : 'Outline'} />}
      className={cn(
        'h-9 gap-2 rounded-full px-3! text-muted-foreground',
        isLiked && 'text-primary',
      )}
      aria-label={isLiked ? 'Unlike activity' : 'Like activity'}
      aria-pressed={isLiked}
      onClick={handleClick}
      isDisabled={isDisabled}
    >
      {formatCompactNumber(likesCount)}
    </Button>
  )
}
