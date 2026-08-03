import ky from 'ky'

import { env } from '../constants/env'

export const api = ky.create({
  prefix: env.VITE_BASE_URL,
  credentials: 'include',
  hooks: {
    afterResponse: [
      ({ response }) => {
        if (response.status === 403) {
          console.debug('ERROR')

          if (!location.pathname.includes('/auth/callback')) {
            window.location.href = '/' // TODO: FIX
          }
        }
      },
    ],
  },
})
