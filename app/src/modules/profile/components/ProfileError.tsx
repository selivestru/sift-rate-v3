import { isHTTPError } from 'ky'
import { useIntlayer } from 'react-intlayer'

import { ErrorState } from '~/common/ui/ErrorState'

interface ProfileErrorProps {
  error?: unknown
}

const isUserNotFound = (error: unknown) => isHTTPError(error) && error.response.status === 404

export const ProfileError = ({ error }: ProfileErrorProps) => {
  const content = useIntlayer('profile-error')

  if (isUserNotFound(error)) {
    return (
      <ErrorState
        title={content.userNotFound.value}
        description={content.profileDoesNotExist.value}
      />
    )
  }

  return <ErrorState title={content.unableToLoadProfile.value} />
}
