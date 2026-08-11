import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { Button } from '~/common/ui/Button'
import { getFirstLetter } from '~/common/utils/getFirstLetter'

import type { ProfileUser } from '../../types/profile.types'

interface ComposerPlaceholderProps {
  user: ProfileUser
}

export const ComposerPlaceholder = ({ user }: ComposerPlaceholderProps) => {
  return (
    <div className="flex items-center gap-3 py-2 sm:gap-4">
      <Avatar size="lg" className="size-11 sm:size-12">
        <AvatarImage src={user.avatarUrl ?? undefined} alt={user.displayName} />
        <AvatarFallback className="text-base sm:text-lg">
          {getFirstLetter(user.displayName)}
        </AvatarFallback>
      </Avatar>

      <Button
        type="button"
        variant="ghost"
        fullWidth
        className="bg-muted hover:bg-accent text-muted-foreground h-11 justify-start rounded-xl px-4 text-left text-[15px] sm:text-base"
        onClick={() => toast.info('Post creation will be available soon')}
      >
        Share something from your archive
      </Button>
    </div>
  )
}
