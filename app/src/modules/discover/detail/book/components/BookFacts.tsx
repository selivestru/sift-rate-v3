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
  const facts: { label: string; value: React.ReactNode }[] = []

  if (book.authors.length > 0) {
    facts.push({ label: 'Authors', value: book.authors.join(', ') })
  }

  if (book.publisher) {
    facts.push({ label: 'Publisher', value: book.publisher })
  }

  const published = formatPublished(book.publishedDate, book.year)
  if (published) {
    facts.push({ label: 'Published', value: published })
  }

  if (book.pageCount != null) {
    facts.push({
      label: 'Pages',
      value: <span className="tabular-nums">{book.pageCount}</span>,
    })
  }

  if (book.language) {
    facts.push({ label: 'Language', value: book.language })
  }

  if (book.printType && book.printType !== 'BOOK') {
    facts.push({ label: 'Type', value: book.printType })
  }

  if (book.isbn13) {
    facts.push({
      label: 'ISBN-13',
      value: <span className="tracking-wide tabular-nums">{book.isbn13}</span>,
    })
  }

  if (book.isbn10) {
    facts.push({
      label: 'ISBN-10',
      value: <span className="tracking-wide tabular-nums">{book.isbn10}</span>,
    })
  }

  if (book.mainCategory) {
    facts.push({ label: 'Main category', value: book.mainCategory })
  }

  if (book.categories.length > 0) {
    facts.push({
      label: 'Categories',
      value: <ChipList items={book.categories.slice(0, 8)} />,
    })
  }

  if (book.isEbook) {
    facts.push({ label: 'Format', value: 'eBook available' })
  }

  if (facts.length === 0) return null

  return (
    <section className="" aria-labelledby="book-facts-heading">
      <h2 id="book-facts-heading" className="text-foreground mb-3 text-lg font-semibold">
        Book info
      </h2>
      <FactsPanel facts={facts} />
    </section>
  )
}
