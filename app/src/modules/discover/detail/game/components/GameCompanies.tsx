import { Building2 } from 'reicon-react'

import { Badge } from '~/common/ui/Badge'
import { cn } from '~/common/utils/cn'

import type { GameCompany, GameCompanyRole } from '../types/game-detail.types'

interface GameCompaniesProps {
  companies: GameCompany[]
  className?: string
}

const ROLE_LABEL: Record<GameCompanyRole, string> = {
  developer: 'Developer',
  publisher: 'Publisher',
  supporting: 'Supporting',
  porting: 'Porting',
}

export const GameCompanies = ({ companies, className }: GameCompaniesProps) => {
  if (companies.length === 0) return null

  return (
    <section className={cn('', className)} aria-labelledby="companies-heading">
      <div className="mb-3 flex items-center gap-2">
        <Building2 className="text-muted-foreground size-4" aria-hidden />
        <h2 id="companies-heading" className="text-foreground text-lg font-semibold">
          Companies
        </h2>
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {companies.map((company) => (
          <li
            key={company.id}
            className="bg-card ring-border flex min-h-16 items-center gap-3 rounded-2xl p-3 ring-1"
          >
            <div className="bg-muted ring-border flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt=""
                  className="size-full object-contain p-1"
                  loading="lazy"
                  width={44}
                  height={44}
                />
              ) : (
                <Building2 className="text-muted-foreground size-5" aria-hidden />
              )}
            </div>
            <div className="flex-1">
              <p className="text-foreground truncate text-sm font-medium">{company.name}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {company.roles.map((role) => (
                  <Badge key={role} className="text-[10px]">
                    {ROLE_LABEL[role]}
                  </Badge>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
