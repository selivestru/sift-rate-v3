import { Prisma } from '~/generated/prisma/client'

export const AUTHOR_SELECT = {
  id: true,
  username: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect
