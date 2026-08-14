import { AnimatePresence, m } from 'motion/react'
import { useEffect, useState } from 'react'
import { X } from 'reicon-react'

import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { Button } from '~/common/ui/Button'
import { Textarea } from '~/common/ui/Textarea'
import { getFirstLetter } from '~/common/utils/getFirstLetter'
import { useAuthStore } from '~/modules/auth'

const COMPOSER_CARD_ID = 'post-composer-card'

export const PostComposer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')

  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow

      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <div className="p-2 sm:p-4">
        <m.button
          layoutId={COMPOSER_CARD_ID}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
          className="bg-card border-border hover:bg-accent focus-visible:ring-ring/40 flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors duration-200 outline-none focus-visible:ring-2"
        >
          <Avatar>
            <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.displayName} />
            <AvatarFallback>{getFirstLetter(user?.displayName)}</AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground text-sm font-medium">Share something…</span>
        </m.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <m.div
              key="post-composer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <m.div
              key="post-composer-modal"
              layoutId={COMPOSER_CARD_ID}
              role="dialog"
              aria-modal="true"
              aria-label="Create post"
              transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
              className="bg-popover text-popover-foreground border-border fixed inset-0 z-50 m-auto h-fit w-full max-w-xl rounded-xl border p-6 shadow-lg"
            >
              <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-medium">Create post</h2>
                  <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    aria-label="Close"
                    onClick={() => setIsOpen(false)}
                  >
                    <X />
                  </Button>
                </div>

                <Textarea
                  autoFocus
                  placeholder="What's new?"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  aria-label="Post content"
                  className="min-h-52"
                />

                <div className="flex justify-end">
                  <Button onClick={() => setIsOpen(false)}>Publish post</Button>
                </div>
              </m.div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
