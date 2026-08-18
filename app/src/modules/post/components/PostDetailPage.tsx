import { Link, useNavigate } from '@tanstack/react-router'

import { BackButton } from '~/common/ui/BackButton'
import { useAuthStore } from '~/modules/auth'

import { useGetPostQuery } from '../hooks/useGetPostQuery'
import { PostItem } from './PostItem'
import { PostModals } from './PostModals'
import { PostReplies } from './PostReplies'
import { PostReplyInput } from './PostReplyInput'

interface PostDetailPageProps {
  postId: string
}

export const PostDetailPage = ({ postId }: PostDetailPageProps) => {
  const navigate = useNavigate()
  const post = useGetPostQuery(postId)

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <div className="divide-border divide-y">
      <div className="mb-2 p-3">
        {post.parentId ? (
          <BackButton render={<Link to="/post/$postId" params={{ postId: post.parentId }} />} />
        ) : (
          <BackButton render={<Link to="/" />} />
        )}
      </div>
      <PostItem isParent data={post} />
      {isAuthenticated && <PostReplyInput postId={post.id} author={post.user.username} />}
      <PostReplies postId={post.id} />

      <PostModals parentPostId={post.id} onParentDeleted={() => navigate({ to: '/' })} />
    </div>
  )
}
