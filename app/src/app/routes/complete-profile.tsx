import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/complete-profile')({
  beforeLoad: ({ context }) => {
    const { user } = context.auth

    if (!user || user.username) {
      throw redirect({ to: '/' })
    }
  },
})
