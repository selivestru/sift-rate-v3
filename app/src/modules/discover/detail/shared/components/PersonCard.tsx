import { User } from 'reicon-react'

import { cn } from '~/common/utils/cn'

interface PersonCardProps {
  name: string
  profileUrl: string | null
  subtitle?: string
  className?: string
}

export const PersonCard = ({ name, profileUrl, subtitle, className }: PersonCardProps) => {
  return (
    <div
      className={cn(
        'group flex w-full flex-col gap-2 transition-transform duration-300 hover:scale-[1.03]',
        className,
      )}
    >
      <div className="bg-muted ring-border group-hover:ring-border relative aspect-2/3 w-full overflow-hidden rounded-xl ring-1 transition-[box-shadow,ring-color] duration-300 group-hover:shadow-lg">
        {profileUrl ? (
          <img
            src={profileUrl}
            alt={name}
            className="size-full object-cover"
            loading="lazy"
            width={185}
            height={278}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <User className="text-muted-foreground size-8 opacity-60" aria-hidden />
          </div>
        )}
      </div>
      <div className="min-w-0 px-0.5">
        <p className="text-foreground truncate text-sm font-medium">{name}</p>
        {subtitle && (
          <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
