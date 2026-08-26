import { Link } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'
import { ChevronRight } from 'reicon-react'

import { libraryChildren, libraryNav } from '~/common/constants/navigation'
import { useNavLabels } from '~/common/i18n'
import { PageHeader } from '~/common/ui/PageHeader'
import { cn } from '~/common/utils/cn'

export const LibraryPage = () => {
  const shared = useIntlayer('shared')
  const content = useIntlayer('library')
  const labels = useNavLabels()

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <PageHeader
        icon={libraryNav.icon}
        label={shared.library.value}
        title={content.title.value}
        description={content.description.value}
      />

      <div className="border-border divide-border divide-y overflow-hidden rounded-xl border">
        {libraryChildren.map((section, index) => (
          <Link
            key={section.to}
            to={section.to}
            className={cn(
              'group hover:bg-accent flex items-center gap-4 px-4 py-4 transition-colors duration-200 sm:gap-5 sm:px-5 sm:py-5',
              'focus-visible:ring-ring/40 focus-visible:bg-accent focus-visible:ring-2 focus-visible:outline-none',
            )}
          >
            <span className="text-muted-foreground w-7 shrink-0 font-mono text-xs tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>

            <span
              className="border-border bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg border"
              style={{ color: section.color }}
            >
              <section.icon className="size-5" strokeWidth={1.75} />
            </span>

            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-semibold tracking-tight sm:text-base">
                {labels[section.to as keyof typeof labels]?.label}
              </p>
              <p className="text-muted-foreground truncate text-sm leading-relaxed">
                {labels[section.to as keyof typeof labels]?.description}
              </p>
            </div>

            <ChevronRight className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed">{content.footer.value}</p>
    </div>
  )
}
