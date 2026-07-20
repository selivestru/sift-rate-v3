import { formatDate } from '~/common/utils/formatDate'
import { formatMoney } from '~/common/utils/formatMoney'
import { formatRuntime } from '~/common/utils/formatRuntime'

import { FactsPanel } from '../../shared'
import type { MovieDetail } from '../types/movie-detail.types'

interface MovieCrewAndFactsProps {
  movie: MovieDetail
}

const CrewGroup = ({ label, names }: { label: string; names: string[] }) => {
  if (names.length === 0) return null

  return (
    <div className="flex flex-col gap-1">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
      <p className="text-foreground text-sm text-pretty">{names.join(', ')}</p>
    </div>
  )
}

const ChipList = ({ items }: { items: string[] }) => (
  <span className="inline-flex flex-wrap justify-end gap-1">
    {items.map((item) => (
      <span
        key={item}
        className="bg-foreground/6 ring-foreground/8 rounded-md px-1.5 py-0.5 text-xs ring-1"
      >
        {item}
      </span>
    ))}
  </span>
)

export const MovieCrewAndFacts = ({ movie }: MovieCrewAndFactsProps) => {
  const hasCrew =
    movie.directors.length > 0 || movie.writers.length > 0 || movie.producers.length > 0

  const facts: { label: string; value: React.ReactNode }[] = []

  if (movie.releaseDate) {
    facts.push({ label: 'Released', value: formatDate(movie.releaseDate) })
  }

  const runtime = formatRuntime(movie.runtimeMinutes)
  if (runtime) {
    facts.push({ label: 'Runtime', value: runtime })
  }

  if (movie.status) {
    facts.push({ label: 'Status', value: movie.status })
  }

  if (movie.languages.length > 0) {
    facts.push({
      label: 'Languages',
      value: <ChipList items={movie.languages.slice(0, 4)} />,
    })
  }

  if (movie.countries.length > 0) {
    facts.push({
      label: 'Countries',
      value: <ChipList items={movie.countries.slice(0, 4)} />,
    })
  }

  const budget = formatMoney(movie.budget)
  if (budget) {
    facts.push({ label: 'Budget', value: <span className="tabular-nums">{budget}</span> })
  }

  const revenue = formatMoney(movie.revenue)
  if (revenue) {
    facts.push({ label: 'Revenue', value: <span className="tabular-nums">{revenue}</span> })
  }

  if (movie.studios.length > 0) {
    facts.push({
      label: 'Studios',
      value: <ChipList items={movie.studios.slice(0, 4)} />,
    })
  }

  if (!hasCrew && facts.length === 0) return null

  return (
    <section
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6"
      aria-labelledby="details-heading"
    >
      <div className="flex flex-col gap-4">
        <h2 id="details-heading" className="text-foreground text-lg font-semibold">
          Details
        </h2>
        {hasCrew ? (
          <div className="bg-card/60 ring-border/50 flex flex-col gap-3.5 rounded-2xl p-4 ring-1">
            <CrewGroup label="Director" names={movie.directors.map((p) => p.name)} />
            <CrewGroup label="Writing" names={movie.writers.map((p) => p.name)} />
            <CrewGroup label="Production" names={movie.producers.map((p) => p.name)} />
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No crew credits available.</p>
        )}
      </div>

      {facts.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-foreground text-lg font-semibold sm:invisible sm:h-7">Facts</h2>
          <FactsPanel facts={facts} />
        </div>
      )}
    </section>
  )
}
