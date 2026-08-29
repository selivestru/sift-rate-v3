import { User } from '~/generated/prisma/client'

export type Author = Pick<User, 'id' | 'username' | 'avatarUrl'>
