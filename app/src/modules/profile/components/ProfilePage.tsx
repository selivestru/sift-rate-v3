import { useGetUserProfileQuery } from '../hooks/useGetUserProfileQuery'
import { ProfileHero } from './ProfileHero'
import { RatingDistribution } from './RatingDistribution'
import { UserActivity } from './UserActivity'
import { UserFeed } from './UserFeed'
import { UserStatsSection } from './UserStatsSection'

interface ProfilePageProps {
  username: string
}

export const ProfilePage = ({ username }: ProfilePageProps) => {
  const { data } = useGetUserProfileQuery(username)

  return (
    <div className="divide-border flex flex-col divide-y">
      <ProfileHero user={data.user} />
      <UserStatsSection reviewStats={data.reviewStats} />
      <RatingDistribution distribution={data.ratingDistribution} />
      <UserActivity username={username} activityYears={data.activityYears} />
      <UserFeed username={username} />
    </div>
  )
}
