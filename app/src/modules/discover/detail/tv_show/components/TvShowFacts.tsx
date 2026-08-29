import { useIntlayer } from 'react-intlayer'

import { useAppLocale } from '~/common/i18n'
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
  const { locale } = useAppLocale()
  const content = useIntlayer('discover-detail')
  const facts: { label: string; value: React.ReactNode }[] = []

  if (show.firstAirDate) {
    facts.push({ label: content.firstAired.value, value: formatDate(show.firstAirDate, locale) })
  }
  if (show.lastAirDate) {
    facts.push({ label: content.lastAired.value, value: formatDate(show.lastAirDate, locale) })
  }
  if (show.status) {
    facts.push({ label: content.status.value, value: show.status })
  }
  if (show.type) {
    facts.push({ label: content.type.value, value: show.type })
  }
  if (show.networks.length > 0) {
    facts.push({
      label: content.network.value,
      value: <ChipList items={show.networks.slice(0, 4)} />,
    })
  }
  if (show.countries.length > 0) {
    facts.push({
      label: content.countries.value,
      value: <ChipList items={show.countries.slice(0, 4)} />,
    })
  }
  if (show.languages.length > 0) {
    facts.push({
      label: content.languages.value,
      value: <ChipList items={show.languages.slice(0, 4)} />,
    })
  }
  if (show.seasonCount > 0) {
    facts.push({
      label: content.seasons.value,
      value: <span className="tabular-nums">{show.seasonCount}</span>,
    })
  }
  if (show.episodeCount > 0) {
    facts.push({
      label: content.episodes.value,
      value: <span className="tabular-nums">{show.episodeCount}</span>,
    })
  }
  const runtime = formatRuntime(show.episodeRunTimeMinutes)
  if (runtime) {
    facts.push({ label: content.runtime.value, value: `${runtime} / ${content.perEpisode.value}` })
  }
  if (show.createdBy.length > 0) {
    facts.push({
      label: content.createdBy.value,
      value: <ChipList items={show.createdBy.slice(0, 4)} />,
    })
  }
  if (show.studios.length > 0) {
    facts.push({
      label: content.studios.value,
      value: <ChipList items={show.studios.slice(0, 4)} />,
    })
  }

  if (facts.length === 0) return null

  return (
    <section className="flex flex-col gap-3" aria-labelledby="tv-details-heading">
      <h2 id="tv-details-heading" className="text-foreground text-lg font-semibold">
        {content.details.value}
      </h2>
      <FactsPanel facts={facts} />
    </section>
  )
}
