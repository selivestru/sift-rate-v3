import { ConfigService } from '@nestjs/config'

import { getJson } from 'serpapi'
import { EnvConfig } from '~/app/config/env.config'

const KINOPOISK_URL_PATTERN = /^https:\/\/www\.kinopoisk\.ru\/(film|series)\/(\d+)\/?$/

const normalizeUrl = (link: string): string =>
  link.split(/[?#]/)[0].replace(/^https:\/\/kinopoisk\.ru/, 'https://www.kinopoisk.ru')

export const extractKinopoiskId = (link: string): string | null => {
  const match = KINOPOISK_URL_PATTERN.exec(normalizeUrl(link))
  return match ? match[2] : null
}

export const getKinopoiskId = async (
  config: ConfigService<EnvConfig, true>,
  title: string,
  year?: string,
): Promise<string | null> => {
  if (!title.trim()) return null

  try {
    const apiKey = config.get('SERPER_API_KEY', { infer: true })
    const query = `site:kinopoisk.ru "${title}"${year ? ` ${year}` : ''}`

    const response = (await getJson({
      engine: 'google_light',
      q: query,
      location: 'Moscow, Moscow, Russia',
      google_domain: 'google.com',
      hl: 'ru',
      gl: 'ru',
      api_key: `${apiKey}`,
    })) as { organic_results: { link: string }[] }

    for (const item of response.organic_results ?? []) {
      if (!item.link) continue
      const id = extractKinopoiskId(item.link)
      if (id) return id
    }
  } catch {
    return null
  }

  return null
}
