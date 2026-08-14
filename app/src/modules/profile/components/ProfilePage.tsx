import type { ProfileResponse } from '../types/profile.types'
import { AchievementsGrid } from './AchievementsGrid'
import { ProfileHero } from './ProfileHero'
import { RatingDistribution } from './RatingDistribution'
import { ReviewActivity } from './ReviewActivity'
import { ReviewStatsSection } from './ReviewStatsSection'

interface ProfilePageProps {
  data: ProfileResponse
}

export const ProfilePage = ({ data }: ProfilePageProps) => {
  return (
    <div className="flex flex-col">
      <ProfileHero user={data.user} />

      <div className="space-y-6">
        <div className="space-y-6 p-4">
          <AchievementsGrid achievements={data.achievements} />
          <ReviewStatsSection reviewStats={data.reviewStats} />
          <RatingDistribution distribution={data.ratingDistribution} />
          <ReviewActivity activity={data.reviewActivity} />
        </div>
      </div>
    </div>
  )
}
