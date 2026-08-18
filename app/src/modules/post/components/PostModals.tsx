import { usePostModalsStore } from '../store/post-modals.store'
import { DeletePostModal } from './DeletePostModal'
import { PostForm } from './PostForm'

interface PostModalsProps {
  parentPostId?: string
  onParentDeleted?: () => void
}

export const PostModals = ({ parentPostId, onParentDeleted }: PostModalsProps) => {
  const modal = usePostModalsStore((state) => state.modal)

  const closeModal = usePostModalsStore((state) => state.closeModal)

  const editModal = modal?.type === 'edit' ? modal : null
  const deleteModal = modal?.type === 'delete' ? modal : null

  return (
    <>
      <PostForm
        mode="edit"
        open={editModal != null}
        postId={editModal?.postId}
        initialContent={editModal?.content}
        parentId={editModal?.parentId ?? null}
        onClose={closeModal}
      />

      <DeletePostModal
        open={deleteModal != null}
        postId={deleteModal?.postId}
        parentId={deleteModal?.parentId ?? null}
        onClose={closeModal}
        onDeleted={deleteModal?.postId === parentPostId ? onParentDeleted : undefined}
      />
    </>
  )
}
