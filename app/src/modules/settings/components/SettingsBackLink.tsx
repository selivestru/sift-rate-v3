import { Link } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'
import { ChevronLeft } from 'reicon-react'

import { cn } from '~/common/utils/cn'

export const SettingsBackLink = () => {
  const shared = useIntlayer('shared')

  return (
    <Link
      to="/"
      className={cn(
        'text-muted-foreground relative flex h-10 items-center gap-2.5 rounded-md px-3 text-sm font-medium transition-colors duration-200',
        'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none',
        'hover:bg-accent hover:text-accent-foreground',
      )}
    >
      <ChevronLeft className="size-5 shrink-0" />
      <span className="flex-1">{shared.back}</span>
    </Link>
  )
}
