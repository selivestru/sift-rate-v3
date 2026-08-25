import { ErrorState } from '~/common/ui/ErrorState'

export const MediaReviewsError = () => {
  return <ErrorState title="Couldn't load reviews" description="Try again later." border />
}
