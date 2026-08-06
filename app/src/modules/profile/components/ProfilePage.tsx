import { Skeleton } from '~/common/ui/Skeleton'

import { useProfileQuery } from '../hooks/useProfileQuery'
import { AchievementsGrid } from './AchievementsGrid'
import { ProfileHero } from './ProfileHero'
import { RatingDistribution } from './RatingDistribution'
import { ReviewActivity } from './ReviewActivity'
import { ReviewStatsSection } from './ReviewStatsSection'

interface ProfilePageProps {
  username: string
}

export const ProfilePage = ({ username }: ProfilePageProps) => {
  const { data, isLoading } = useProfileQuery(username)

  if (isLoading) return <ProfileSkeleton />

  if (!data) return null

  return (
    <div className="flex flex-col">
      <ProfileHero user={data.user} />

      <div className="space-y-6 p-4">
        <AchievementsGrid achievements={data.achievements} />
        <RatingDistribution distribution={data.ratingDistribution} />
        <ReviewActivity activity={data.reviewActivity} />
        <ReviewStatsSection reviewStats={data.reviewStats} />
      </div>
    </div>
  )
}

const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col">
      <div className="relative">
        <Skeleton className="h-70 rounded-t-2xl rounded-b-none max-md:h-50" />
        <div className="relative px-6 pt-0 pb-6 max-md:px-4">
          <div className="-mt-16 flex items-end gap-5 max-md:-mt-12 max-md:gap-4">
            <Skeleton className="size-32 shrink-0 rounded-full max-md:size-24" />
            <div className="flex-1 space-y-2 pb-1">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-2 h-5 w-16" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    </div>
  )
}
