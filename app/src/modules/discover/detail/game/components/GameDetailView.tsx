import type { GameDetail } from '../types/game-detail.types'
import { GameCompanies } from './GameCompanies'
import { GameFacts } from './GameFacts'
import { GameGallery } from './GameGallery'
import { GameHero } from './GameHero'
import { GamePlatforms } from './GamePlatforms'
import { GameRelated } from './GameRelated'
import { GameSimilar } from './GameSimilar'
import { GameVideos } from './GameVideos'
import { GameWebsites } from './GameWebsites'

interface GameDetailViewProps {
  game: GameDetail
}

export const GameDetailView = ({ game }: GameDetailViewProps) => {
  const hasPlatforms = game.platforms.length > 0
  const hasGallery = game.screenshots.length > 0 || game.artworks.length > 0
  const hasVideos = game.videos.length > 0
  const hasWebsites = game.websites.length > 0
  const hasCompanies = game.companies.length > 0
  const hasSimilar = game.similar.length > 0
  const hasRelated =
    Boolean(game.parentGame) ||
    game.dlcs.length > 0 ||
    game.expansions.length > 0 ||
    game.standaloneExpansions.length > 0 ||
    game.remakes.length > 0 ||
    game.remasters.length > 0 ||
    game.ports.length > 0

  const hasFacts =
    game.developers.length > 0 ||
    game.publishers.length > 0 ||
    game.engines.length > 0 ||
    Boolean(game.releaseDate) ||
    game.ageRatings.length > 0 ||
    game.genres.length > 0 ||
    game.themes.length > 0 ||
    game.gameModes.length > 0 ||
    game.playerPerspectives.length > 0 ||
    game.platforms.length > 0 ||
    game.languages.length > 0 ||
    game.franchises.length > 0 ||
    game.collections.length > 0 ||
    Boolean(game.storyline)

  return (
    <div className="flex max-w-full min-w-0 flex-col overflow-x-clip">
      <GameHero game={game} />

      <div className="flex min-w-0 flex-col gap-8 p-3 pb-8 md:p-6 md:pb-10">
        {hasPlatforms && <GamePlatforms platforms={game.platforms} />}

        {hasGallery && (
          <GameGallery title={game.title} screenshots={game.screenshots} artworks={game.artworks} />
        )}

        {hasVideos && <GameVideos videos={game.videos} />}

        {hasWebsites && <GameWebsites websites={game.websites} />}

        {hasFacts && <GameFacts game={game} />}

        {hasCompanies && <GameCompanies companies={game.companies} />}

        {hasRelated && <GameRelated game={game} />}

        {hasSimilar && <GameSimilar items={game.similar} />}
      </div>
    </div>
  )
}
