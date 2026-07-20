import type { BookDetail } from '../types/book-detail.types'
import { BookDescription } from './BookDescription'
import { BookFacts } from './BookFacts'
import { BookHero } from './BookHero'
import { BookLinks } from './BookLinks'
import { BookMoreByAuthor } from './BookMoreByAuthor'

interface BookDetailViewProps {
  book: BookDetail
}

export const BookDetailView = ({ book }: BookDetailViewProps) => {
  const hasDescription = Boolean(book.description)
  const hasLinks = Boolean(book.previewUrl || book.infoUrl || book.buyUrl)
  const hasMoreByAuthor = book.moreByAuthor.length > 0 && Boolean(book.primaryAuthor)
  const hasFacts =
    book.authors.length > 0 ||
    Boolean(book.publisher) ||
    Boolean(book.publishedDate) ||
    book.pageCount != null ||
    Boolean(book.language) ||
    (Boolean(book.printType) && book.printType !== 'BOOK') ||
    Boolean(book.isbn10) ||
    Boolean(book.isbn13) ||
    Boolean(book.mainCategory) ||
    book.categories.length > 0 ||
    book.isEbook

  return (
    <div className="flex max-w-full min-w-0 flex-col overflow-x-clip">
      <BookHero book={book} />

      <div className="flex min-w-0 flex-col gap-8 p-3 pb-8 md:p-6 md:pb-10">
        {hasDescription && <BookDescription description={book.description} />}

        {hasFacts && <BookFacts book={book} />}

        {hasLinks && <BookLinks book={book} />}

        {hasMoreByAuthor && (
          <BookMoreByAuthor author={book.primaryAuthor} items={book.moreByAuthor} />
        )}
      </div>
    </div>
  )
}
