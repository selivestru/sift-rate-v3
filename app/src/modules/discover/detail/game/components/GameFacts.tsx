import { formatDate } from '~/common/utils/formatDate'

import { FactsPanel } from '../../shared'
import type { GameDetail } from '../types/game-detail.types'

interface GameFactsProps {
  game: GameDetail
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

const joinOrNull = (items: string[], limit = 8) => {
  if (items.length === 0) return null
  const shown = items.slice(0, limit)
  const extra = items.length - shown.length
  return extra > 0 ? `${shown.join(', ')} +${extra}` : shown.join(', ')
}

export const GameFacts = ({ game }: GameFactsProps) => {
  const facts: { label: string; value: React.ReactNode }[] = []

  if (game.developers.length > 0) {
    facts.push({ label: 'Developer', value: game.developers.join(', ') })
  }

  if (game.publishers.length > 0) {
    facts.push({ label: 'Publisher', value: game.publishers.join(', ') })
  }

  if (game.engines.length > 0) {
    facts.push({ label: 'Engine', value: game.engines.join(', ') })
  }

  if (game.releaseDate) {
    facts.push({ label: 'Released', value: formatDate(game.releaseDate) })
  }

  if (game.ageRatings.length > 0) {
    facts.push({ label: 'Age rating', value: <ChipList items={game.ageRatings} /> })
  }

  if (game.genres.length > 0) {
    facts.push({ label: 'Genres', value: <ChipList items={game.genres} /> })
  }

  if (game.themes.length > 0) {
    facts.push({ label: 'Themes', value: <ChipList items={game.themes.slice(0, 8)} /> })
  }

  if (game.gameModes.length > 0) {
    facts.push({ label: 'Game modes', value: game.gameModes.join(', ') })
  }

  if (game.playerPerspectives.length > 0) {
    facts.push({ label: 'Perspective', value: game.playerPerspectives.join(', ') })
  }

  if (game.platforms.length > 0) {
    facts.push({
      label: 'Platforms',
      value: joinOrNull(
        game.platforms.map((p) => p.name),
        10,
      ),
    })
  }

  if (game.languages.length > 0) {
    facts.push({
      label: 'Languages',
      value: joinOrNull(game.languages, 12),
    })
  }

  if (game.franchises.length > 0) {
    facts.push({ label: 'Franchise', value: game.franchises.join(', ') })
  }

  if (game.collections.length > 0) {
    facts.push({ label: 'Collection', value: game.collections.join(', ') })
  }

  if (game.storyline) {
    facts.push({
      label: 'Storyline',
      value: <span className="text-left text-pretty">{game.storyline}</span>,
    })
  }

  if (facts.length === 0) return null

  return (
    <section className="" aria-labelledby="game-facts-heading">
      <h2 id="game-facts-heading" className="text-foreground mb-3 text-lg font-semibold">
        Game info
      </h2>
      <FactsPanel facts={facts} />
    </section>
  )
}
