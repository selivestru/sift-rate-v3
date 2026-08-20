import { isHTTPError } from 'ky'

import { ErrorState } from '~/common/ui/ErrorState'

interface ProfileErrorProps {
  error?: unknown
}

const isUserNotFound = (error: unknown) => isHTTPError(error) && error.response.status === 404

export const ProfileError = ({ error }: ProfileErrorProps) => {
  if (isUserNotFound(error)) {
    return <ErrorState title="User not found" description="This profile doesn't exist." />
  }

  return <ErrorState title="Couldn't load profile" />
}
