import { PostItemSkeleton } from './PostItemSkeleton'

export const PostListSkeleton = () => {
  return (
    <div className="divide-border divide-y">
      {Array.from({ length: 5 }).map((_, index) => (
        // oxlint-disable-next-line react/no-array-index-key
        <PostItemSkeleton key={index} />
      ))}
    </div>
  )
}
