import { create } from 'zustand'

export type PostModalState =
  | { type: 'edit'; postId: string; content: string; parentId: string | null }
  | { type: 'delete'; postId: string; parentId: string | null }
  | null

interface PostModalsState {
  modal: PostModalState
  openEditModal: (postId: string, content: string, parentId: string | null) => void
  openDeleteModal: (postId: string, parentId: string | null) => void
  closeModal: () => void
}

export const usePostModalsStore = create<PostModalsState>()((set) => ({
  modal: null,
  openEditModal: (postId, content, parentId) =>
    set({ modal: { type: 'edit', postId, content, parentId } }),
  openDeleteModal: (postId, parentId) => set({ modal: { type: 'delete', postId, parentId } }),
  closeModal: () => set({ modal: null }),
}))
