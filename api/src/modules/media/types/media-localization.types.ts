import { MediaLanguage } from '~/generated/prisma/enums'

export interface MediaLocalizationSnapshot {
  language: MediaLanguage
  title: string | null
  posterUrl: string | null
}
