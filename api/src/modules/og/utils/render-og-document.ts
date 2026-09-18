import type { OgPreview } from '../types/og.types'

export const SITE_TITLE = 'SiftRate — your media life archive'
export const SITE_DESCRIPTION =
  "Track the movies, shows, games, books and music you've lived through. Rate them, keep a personal timeline, own your media story."
export const SITE_IMAGE_PATH = '/og-image.png'

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char)

interface OgDocumentParams {
  preview: OgPreview | null
  pageUrl: string
  siteUrl: string
}

export const renderOgDocument = ({ preview, pageUrl, siteUrl }: OgDocumentParams) => {
  const title = escapeHtml(preview?.title || SITE_TITLE)
  const description = escapeHtml(preview?.description || SITE_DESCRIPTION)
  const imageUrl = escapeHtml(preview?.imageUrl ?? `${siteUrl}${SITE_IMAGE_PATH}`)
  const type = escapeHtml(preview?.type ?? 'website')
  const url = escapeHtml(pageUrl)

  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <meta name="description" content="${description}" />
        <link rel="canonical" href="${url}" />
        <meta property="og:type" content="${type}" />
        <meta property="og:url" content="${url}" />
        <meta property="og:site_name" content="SiftRate" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:image:alt" content="${title}" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${imageUrl}" />
      </head>
      <body>
        <h1>${title}</h1>
        <p>${description}</p>
        <a href="${url}">Open on SiftRate</a>
      </body>
    </html>
  `
}
