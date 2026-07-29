import type { User } from './user.type'

export interface LoginResponse {
  user: User
}

export interface RegisterResponse {
  message: string
}
