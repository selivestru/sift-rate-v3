import { useIntlayer } from 'react-intlayer'
import { Link6, ShoppingBag } from 'reicon-react'

import { mediaTypeMeta } from '~/common/constants/media-type'
import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'

import type { BookDetail } from '../types/book-detail.types'

interface BookLinksProps {
  book: BookDetail
  className?: string
}

export const BookLinks = ({ book, className }: BookLinksProps) => {
  const content = useIntlayer('discover-detail')
  const links: Array<{ label: string; url: string; icon: typeof Link6 }> = []
  const MediaTypeIcon = mediaTypeMeta.BOOK.icon

  if (book.previewUrl) {
    links.push({ label: content.preview.value, url: book.previewUrl, icon: MediaTypeIcon })
  }

  if (book.infoUrl) {
    links.push({ label: 'Google Books', url: book.infoUrl, icon: Link6 })
  }

  if (book.buyUrl) {
    links.push({ label: content.buy.value, url: book.buyUrl, icon: ShoppingBag })
  }

  if (links.length === 0) return null

  return (
    <section className={cn('', className)} aria-labelledby="book-links-heading">
      <h2 id="book-links-heading" className="text-foreground mb-3 text-lg font-semibold">
        {content.links.value}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <li key={link.url}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                render={<a href={link.url} target="_blank" rel="noopener noreferrer" />}
              >
                <Icon className="size-3.5 shrink-0" aria-hidden />
                {link.label}
                <Link6 className="text-muted-foreground size-3 shrink-0 opacity-70" aria-hidden />
              </Button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
