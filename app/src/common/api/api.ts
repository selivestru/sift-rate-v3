import ky from 'ky'

import { env } from '../constants/env'
import { getCurrentLocale } from '../i18n'

export const api = ky.create({
  prefix: env.VITE_BASE_URL,
  credentials: 'include',
  retry: 0,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        request.headers.set('Accept-Language', getCurrentLocale())
      },
    ],
  },
})
