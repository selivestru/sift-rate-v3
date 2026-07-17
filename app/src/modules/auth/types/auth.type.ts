import type { User } from './user.type'

export interface LoginResponse {
  user: User
}

export type RegisterResponse = LoginResponse
