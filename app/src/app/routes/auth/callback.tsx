import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

import { AuthCallback } from '~/modules/auth'

const searchSchema = z.object({
  error: z.string().optional(),
})

export const Route = createFileRoute('/auth/callback')({
  validateSearch: (search) => searchSchema.parse(search),
  component: RouteComponent,
})

function RouteComponent() {
  const { error } = Route.useSearch()

  return <AuthCallback error={error} />
}
