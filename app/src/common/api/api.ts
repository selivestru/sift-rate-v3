import ky from 'ky'

import { env } from '../constants/env'

export const api = ky.create({
  prefix: env.VITE_BASE_URL,
  credentials: 'include',
  retry: 0,
})
