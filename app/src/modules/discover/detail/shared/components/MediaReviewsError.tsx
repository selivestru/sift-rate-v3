import { useIntlayer } from 'react-intlayer'

import { ErrorState } from '~/common/ui/ErrorState'

export const MediaReviewsError = () => {
  const shared = useIntlayer('shared')
  return (
    <ErrorState
      title={shared.somethingWentWrong.value}
      description={shared.tryAgainLater.value}
      border
    />
  )
}
