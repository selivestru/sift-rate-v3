import { Link } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'
import { ChevronRight, Film, type IconComponent } from 'reicon-react'

import { PageHeader } from '~/common/ui/PageHeader'
import { cn } from '~/common/utils/cn'
import { importsNavItem } from '~/modules/settings'

type ImportService = {
  name: string
  icon: IconComponent
  isAvailable: boolean
  to?: string
}

const IMPORT_SERVICES: ImportService[] = [
  {
    name: 'IMDb',
    icon: Film,
    isAvailable: true,
    to: '/settings/imports/imdb',
  },
]

export const ImportsSettings = () => {
  const content = useIntlayer('imports-settings')
  const shared = useIntlayer('shared')
  const settingsNav = useIntlayer('settings-nav')

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <PageHeader
        icon={importsNavItem.icon}
        label={shared.settings.value}
        title={settingsNav.imports.value}
        description={content.pageDescription.value}
      />

      <ul className="flex flex-col gap-3">
        {IMPORT_SERVICES.map((service) => {
          const serviceContent = (
            <>
              <span
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-lg',
                  service.isAvailable ? 'bg-accent text-primary' : 'bg-muted text-muted-foreground',
                )}
              >
                <service.icon className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm font-medium">{service.name}</span>
                <span className="text-muted-foreground text-xs leading-relaxed">
                  {content.imdbDescription.value}
                </span>
              </span>
              <ChevronRight className="text-muted-foreground size-4 shrink-0" aria-hidden />
            </>
          )

          const className = cn(
            'border-border bg-card flex items-center gap-3.5 rounded-xl border px-4 py-3.5',
            service.isAvailable
              ? cn(
                  'hover:bg-accent transition-colors duration-200',
                  'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none',
                )
              : 'opacity-70',
          )

          return (
            <li key={service.name}>
              {service.isAvailable && service.to ? (
                <Link
                  to={service.to}
                  className={className}
                  aria-label={content.importFrom({ service: service.name }).value}
                >
                  {serviceContent}
                </Link>
              ) : (
                <div className={className} aria-disabled="true">
                  {serviceContent}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
