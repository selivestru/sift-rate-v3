import { useState } from 'react'

import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'

interface PostContentProps {
  content: string
  isReview: boolean
  maxLength?: number
}

export const PostContent = ({ content, isReview = false, maxLength = 280 }: PostContentProps) => {
  const [expanded, setExpanded] = useState(false)
  const isLong = content.length > maxLength
  const visible = expanded || !isLong ? content : `${content.slice(0, maxLength)}…`

  return (
    <blockquote className={cn(isReview ? 'border-border border-t px-3 py-2' : 'mt-1')}>
      <p className="text-foreground text-[15px] leading-relaxed break-all">{visible}</p>

      {isLong && !expanded && (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setExpanded(true)}
          className="text-muted-foreground hover:text-primary relative z-10 -ml-2 h-auto px-2 py-0.5"
        >
          Show more
        </Button>
      )}
    </blockquote>
  )
}
