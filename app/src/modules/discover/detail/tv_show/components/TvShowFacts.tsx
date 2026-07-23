import { formatDate } from '~/common/utils/formatDate'
import { formatRuntime } from '~/common/utils/formatRuntime'

import { FactsPanel } from '../../shared'
import type { TvShowDetail } from '../types/tv-show-detail.types'

interface TvShowFactsProps {
  show: TvShowDetail
}

const ChipList = ({ items }: { items: string[] }) => (
  <span className="inline-flex flex-wrap justify-end gap-1">
    {items.map((item) => (
      <span key={item} className="bg-muted ring-border rounded-md px-1.5 py-0.5 text-xs ring-1">
        {item}
      </span>
    ))}
  </span>
)

export const TvShowFacts = ({ show }: TvShowFactsProps) => {
  const facts: { label: string; value: React.ReactNode }[] = []

  if (show.firstAirDate) {
    facts.push({ label: 'First aired', value: formatDate(show.firstAirDate) })
  }
  if (show.lastAirDate) {
    facts.push({ label: 'Last aired', value: formatDate(show.lastAirDate) })
  }
  if (show.status) {
    facts.push({ label: 'Status', value: show.status })
  }
  if (show.type) {
    facts.push({ label: 'Type', value: show.type })
  }
  if (show.networks.length > 0) {
    facts.push({ label: 'Network', value: <ChipList items={show.networks.slice(0, 4)} /> })
  }
  if (show.countries.length > 0) {
    facts.push({ label: 'Countries', value: <ChipList items={show.countries.slice(0, 4)} /> })
  }
  if (show.languages.length > 0) {
    facts.push({ label: 'Languages', value: <ChipList items={show.languages.slice(0, 4)} /> })
  }
  if (show.seasonCount > 0) {
    facts.push({
      label: 'Seasons',
      value: <span className="tabular-nums">{show.seasonCount}</span>,
    })
  }
  if (show.episodeCount > 0) {
    facts.push({
      label: 'Episodes',
      value: <span className="tabular-nums">{show.episodeCount}</span>,
    })
  }
  const runtime = formatRuntime(show.episodeRunTimeMinutes)
  if (runtime) {
    facts.push({ label: 'Runtime', value: `${runtime} / ep` })
  }
  if (show.createdBy.length > 0) {
    facts.push({ label: 'Created by', value: <ChipList items={show.createdBy.slice(0, 4)} /> })
  }
  if (show.studios.length > 0) {
    facts.push({ label: 'Studios', value: <ChipList items={show.studios.slice(0, 4)} /> })
  }

  if (facts.length === 0) return null

  return (
    <section className="flex flex-col gap-3" aria-labelledby="tv-details-heading">
      <h2 id="tv-details-heading" className="text-foreground text-lg font-semibold">
        Details
      </h2>
      <FactsPanel facts={facts} />
    </section>
  )
}
