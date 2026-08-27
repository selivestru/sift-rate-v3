import { createFileRoute, redirect } from '@tanstack/react-router'

import { authGoogleCallbackSearchSchema } from '~/modules/auth'

export const Route = createFileRoute('/auth/google/callback')({
  validateSearch: (search) => {
    const result = authGoogleCallbackSearchSchema.safeParse(search)

    return {
      status: result.success ? result.data.status : null,
    }
  },
  beforeLoad: ({ search }) => {
    if (!search.status) {
      throw redirect({ to: '/auth' })
    }

    return search
  },
})
