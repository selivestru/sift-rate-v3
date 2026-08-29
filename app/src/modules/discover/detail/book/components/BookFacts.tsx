import { useIntlayer } from 'react-intlayer'

import { useAppLocale } from '~/common/i18n'

import { FactsPanel } from '../../shared'
import type { BookDetail } from '../types/book-detail.types'
import { formatPublished } from '../utils/format-published'

interface BookFactsProps {
  book: BookDetail
}

const ChipList = ({ items }: { items: string[] }) => (
  <span className="inline-flex flex-wrap justify-end gap-1">
    {items.map((item) => (
      <span key={item} className="bg-muted ring-border rounded-md px-1.5 py-0.5 text-xs ring-1">
        {item}
      </span>
    ))}
  </span>
)

export const BookFacts = ({ book }: BookFactsProps) => {
  const { locale } = useAppLocale()
  const content = useIntlayer('discover-detail')
  const facts: { label: string; value: React.ReactNode }[] = []

  if (book.authors.length > 0) {
    facts.push({ label: content.authors.value, value: book.authors.join(', ') })
  }

  if (book.publisher) {
    facts.push({ label: content.publisher.value, value: book.publisher })
  }

  const published = formatPublished(book.publishedDate, book.year, locale)
  if (published) {
    facts.push({ label: content.published.value, value: published })
  }

  if (book.pageCount != null) {
    facts.push({
      label: content.pages.value,
      value: <span className="tabular-nums">{book.pageCount}</span>,
    })
  }

  if (book.language) {
    facts.push({ label: content.language.value, value: book.language })
  }

  if (book.printType && book.printType !== 'BOOK') {
    facts.push({ label: content.type.value, value: book.printType })
  }

  if (book.isbn13) {
    facts.push({
      label: content.isbn13.value,
      value: <span className="tracking-wide tabular-nums">{book.isbn13}</span>,
    })
  }

  if (book.isbn10) {
    facts.push({
      label: content.isbn10.value,
      value: <span className="tracking-wide tabular-nums">{book.isbn10}</span>,
    })
  }

  if (book.mainCategory) {
    facts.push({ label: content.mainCategory.value, value: book.mainCategory })
  }

  if (book.categories.length > 0) {
    facts.push({
      label: content.categories.value,
      value: <ChipList items={book.categories.slice(0, 8)} />,
    })
  }

  if (book.isEbook) {
    facts.push({ label: content.format.value, value: content.ebookAvailable.value })
  }

  if (facts.length === 0) return null

  return (
    <section className="" aria-labelledby="book-facts-heading">
      <h2 id="book-facts-heading" className="text-foreground mb-3 text-lg font-semibold">
        {content.bookInfo.value}
      </h2>
      <FactsPanel facts={facts} />
    </section>
  )
}
