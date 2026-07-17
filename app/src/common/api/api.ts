import ky from 'ky'

import { env } from '../constants/env'

export const api = ky.create({
  baseUrl: env.VITE_BASE_URL,
  credentials: 'include',
})
