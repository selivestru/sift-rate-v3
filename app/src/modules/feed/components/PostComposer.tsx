import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { getFirstLetter } from '~/common/utils/getFirstLetter'
import { useAuthStore } from '~/modules/auth'
import { PostForm } from '~/modules/post'

export const PostComposer = () => {
  const [isOpen, setIsOpen] = useState(false)

  const user = useAuthStore((state) => state.user)

  const close = () => setIsOpen(false)

  return (
    <>
      <div className="p-2 sm:p-4">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
          className="bg-card border-border hover:bg-accent focus-visible:ring-ring/40 flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors duration-200 outline-none focus-visible:ring-2"
        >
          <Avatar>
            <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.displayName} />
            <AvatarFallback>{getFirstLetter(user?.displayName)}</AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground text-sm font-medium">Share something…</span>
        </button>
      </div>

      <PostForm mode="create" open={isOpen} onClose={close} />
    </>
  )
}
