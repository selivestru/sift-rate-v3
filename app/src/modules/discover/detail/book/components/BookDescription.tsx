import { useState } from 'react'
import { useIntlayer } from 'react-intlayer'

import { cn } from '~/common/utils/cn'

interface BookDescriptionProps {
  description: string
}

export const BookDescription = ({ description }: BookDescriptionProps) => {
  const [expanded, setExpanded] = useState(false)
  const shared = useIntlayer('shared')
  const content = useIntlayer('discover-detail')
  const long = description.length > 420

  if (!description) return null

  return (
    <section className="" aria-labelledby="book-description-heading">
      <h2 id="book-description-heading" className="text-foreground mb-3 text-lg font-semibold">
        {content.synopsis}
      </h2>
      <p
        className={cn(
          'text-sm leading-relaxed text-pretty whitespace-pre-line text-muted-foreground sm:text-[0.9375rem] sm:leading-7',
          !expanded && long && 'line-clamp-6',
        )}
      >
        {description}
      </p>
      {long && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-foreground mt-2 cursor-pointer text-xs font-medium underline-offset-2 hover:underline"
        >
          {shared.showMore}
        </button>
      )}
    </section>
  )
}
