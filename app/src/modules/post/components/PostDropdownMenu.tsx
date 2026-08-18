import { Copy, Edit, MoreH, Trash } from 'reicon-react'
import { toast } from 'sonner'

import { useCopy } from '~/common/hooks/useCopy'
import { Button } from '~/common/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/common/ui/DropdownMenu'
import { useAuthStore } from '~/modules/auth'

import { usePostModalsStore } from '../store/post-modals.store'
import type { Post } from '../types/post.types'

interface PostDropdownMenuProps {
  post: Post
}

export const PostDropdownMenu = ({ post }: PostDropdownMenuProps) => {
  const currentUserId = useAuthStore((state) => state.user?.id)

  const { copy } = useCopy()

  const isOwn = currentUserId === post.userId

  const handleCopyLink = () => {
    copy(`${window.location.origin}/post/${post.id}`)

    toast.success('Copied')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            className="z-px relative rounded-full"
            aria-label="Post actions"
          />
        }
      >
        <MoreH weight="Filled" className="size-6" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        {isOwn && post.content != null && (
          <DropdownMenuItem
            onClick={() =>
              usePostModalsStore
                .getState()
                .openEditModal(post.id, post.content ?? '', post.parentId)
            }
          >
            <Edit />
            Edit
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy />
          Copy link
        </DropdownMenuItem>

        {isOwn && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => usePostModalsStore.getState().openDeleteModal(post.id, post.parentId)}
            >
              <Trash />
              Delete
            </DropdownMenuItem>
          </>
        )}
        {/* <DropdownMenuItem variant="destructive">
            <Flag />
            Report
          </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
