import { useState } from 'react'
import { useIntlayer } from 'react-intlayer'

import { Button } from '~/common/ui/Button'

interface FeedContentProps {
  content: string
  maxLength?: number
}

export const FeedContent = ({ content, maxLength = 280 }: FeedContentProps) => {
  const shared = useIntlayer('shared')
  const [expanded, setExpanded] = useState(false)
  const isLong = content.length > maxLength
  const visible = expanded || !isLong ? content : `${content.slice(0, maxLength)}…`

  return (
    <blockquote className="border-border border-t px-3 py-2.5">
      <p className="text-foreground text-sm leading-relaxed break-all whitespace-pre-wrap italic">
        {visible}
      </p>

      {isLong && !expanded && (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setExpanded(true)}
          className="text-muted-foreground hover:text-primary -ml-2 h-auto px-2 py-0.5"
        >
          {shared.showMore.value}
        </Button>
      )}
    </blockquote>
  )
}
