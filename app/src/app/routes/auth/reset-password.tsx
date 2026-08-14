import { createFileRoute } from '@tanstack/react-router'

import { Loader } from '~/common/ui/Loader'
import {
  authApi,
  ResetPasswordForm,
  ResetPasswordVerifyError,
  validateResetPasswordSearch,
} from '~/modules/auth'

export const Route = createFileRoute('/auth/reset-password')({
  validateSearch: validateResetPasswordSearch,
  loaderDeps: ({ search }) => ({ token: search.token }),
  loader: async ({ deps }) => {
    return authApi.resetPasswordVerify(deps.token)
  },
  pendingComponent: Loader,
  errorComponent: ResetPasswordVerifyError,
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useSearch()
  return <ResetPasswordForm token={token} />
}
