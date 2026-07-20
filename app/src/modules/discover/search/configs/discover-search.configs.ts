import { MEDIA_TYPES, type MediaType } from '~/common/constants/media-type'

import { albumSearchConfig } from './album-search.config'
import { bookSearchConfig } from './book-search.config'
import { gameSearchConfig } from './game-search.config'
import { movieSearchConfig } from './movie-search.config'
import { trackSearchConfig } from './track-search.config'
import { tvSearchConfig } from './tv-search.config'

export const discoverSearchConfigs = {
  [MEDIA_TYPES.MOVIE]: movieSearchConfig,
  [MEDIA_TYPES.TV_SHOW]: tvSearchConfig,
  [MEDIA_TYPES.GAME]: gameSearchConfig,
  [MEDIA_TYPES.BOOK]: bookSearchConfig,
  [MEDIA_TYPES.ALBUM]: albumSearchConfig,
  [MEDIA_TYPES.TRACK]: trackSearchConfig,
}

export type DiscoverSearchConfigByMediaType = typeof discoverSearchConfigs

export const getDiscoverSearchConfig = <T extends MediaType>(mediaType: T) => {
  return discoverSearchConfigs[mediaType]
}
