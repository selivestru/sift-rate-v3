import { api } from '~/common/api'

import type {
  ImportHistoryResponse,
  ImportJobResponse,
  ImportJobRowsResponse,
  ImportRowStatus,
} from '../types/import.types'

export const importApi = {
  getActiveImdbImport: async () => {
    const response = await api.get('import/imdb/active')
    const body = await response.text()

    if (!body || body === 'null') {
      return null
    }

    return JSON.parse(body) as ImportJobResponse
  },
  getImdbImport: (id: string) => {
    return api.get(`import/imdb/${id}`).json<ImportJobResponse>()
  },
  getImdbImportHistory: (cursor?: string) => {
    const searchParams = new URLSearchParams()

    if (cursor) {
      searchParams.set('cursor', cursor)
    }

    return api.get('import/imdb/history', { searchParams }).json<ImportHistoryResponse>()
  },
  getImdbImportRows: (id: string, params?: { cursor?: string; status?: ImportRowStatus }) => {
    const searchParams = new URLSearchParams()

    if (params?.cursor) {
      searchParams.set('cursor', params.cursor)
    }

    if (params?.status) {
      searchParams.set('status', params.status)
    }

    return api.get(`import/imdb/${id}/rows`, { searchParams }).json<ImportJobRowsResponse>()
  },
  uploadImdbImport: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('import/imdb', { body: formData }).json<ImportJobResponse>()
  },
  retryImdbImport: (id: string) => {
    return api.post(`import/imdb/${id}/retry`).json<ImportJobResponse>()
  },
}
