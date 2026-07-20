import { api } from '~/common/api'

import type { BookDetail } from '../types/book-detail.types'

export const bookDetailApi = {
  getBook: (id: string) => api.get(`media/book/${id}`).json<BookDetail>(),
}
