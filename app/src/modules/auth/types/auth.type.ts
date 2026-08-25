import type { User } from './user.type'

export interface MeResponse {
  user: User
}

export interface CompleteProfileResponse {
  displayName: string
  username: string
}
