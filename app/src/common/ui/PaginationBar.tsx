import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'

import { cn } from '../utils/cn'

interface PaginationBarProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const getPageNumbers = (currentPage: number, totalPages: number) => {
  const pages: (number | 'ellipsis')[] = []

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  pages.push(1)

  if (currentPage > 3) {
    pages.push('ellipsis')
  }

  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (currentPage < totalPages - 2) {
    pages.push('ellipsis')
  }

  pages.push(totalPages)

  return pages
}

export const PaginationBar = ({ page, totalPages, onPageChange }: PaginationBarProps) => {
  if (totalPages <= 1) {
    return null
  }

  return (
    <nav
      aria-label="pagination"
      className={cn(
        'bg-foreground/5 border-border/50 inline-flex items-center gap-1 rounded-2xl border p-1.5 backdrop-blur-xl animate-blur-morph-in w-fit mx-auto',
      )}
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={cn(
          'flex h-9 items-center gap-1 rounded-xl px-2.5 text-sm font-medium transition-all duration-300 ease-out cursor-pointer',
          'text-muted-foreground hover:bg-foreground/10 hover:text-foreground active:scale-97',
          'disabled:pointer-events-none disabled:opacity-30',
          'hover:scale-102',
        )}
      >
        <ChevronLeftIcon className="size-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {getPageNumbers(page, totalPages).map((p, i) =>
        p === 'ellipsis' ? (
          <span
            key={i === 1 ? 'ellipsis-start' : 'ellipsis-end'}
            className="flex size-9 items-center justify-center"
          >
            <MoreHorizontalIcon className="text-muted-foreground size-4" />
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={cn(
              'flex size-9 items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 ease-out cursor-pointer',
              p === page
                ? 'bg-accent/15 border-accent/30 text-accent scale-102 border shadow-sm'
                : 'text-muted-foreground hover:bg-foreground/10 hover:text-foreground hover:scale-102 active:scale-97',
            )}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={cn(
          'flex h-9 items-center gap-1 rounded-xl px-2.5 text-sm font-medium transition-all duration-300 ease-out cursor-pointer',
          'text-muted-foreground hover:bg-foreground/10 hover:text-foreground active:scale-97',
          'disabled:pointer-events-none disabled:opacity-30',
          'hover:scale-102',
        )}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRightIcon className="size-4" />
      </button>
    </nav>
  )
}
