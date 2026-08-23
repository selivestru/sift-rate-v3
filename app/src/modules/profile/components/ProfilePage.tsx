import { useGetUserProfileQuery } from '../hooks/useGetUserProfileQuery'
import { PrivateProfileNotice } from './PrivateProfileNotice'
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

  const canSeeProfile =
    !data.user.isPrivate || data.followStatus === 'FOLLOWING' || data.followStatus === 'MUTUAL'

  return (
    <div className="divide-border flex flex-col divide-y">
      <ProfileHero
        user={data.user}
        followStatus={data.followStatus}
        followersCount={data.followersCount}
        followingCount={data.followingCount}
      />
      {canSeeProfile ? (
        <>
          {data.reviewStats && <UserStatsSection reviewStats={data.reviewStats} />}
          {data.ratingDistribution && <RatingDistribution distribution={data.ratingDistribution} />}
          <UserActivity username={data.user.username} />
          <UserFeed username={data.user.username} />
        </>
      ) : (
        <PrivateProfileNotice />
      )}
    </div>
  )
}
