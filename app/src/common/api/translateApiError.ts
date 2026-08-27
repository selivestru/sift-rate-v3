import { getLocalizedContent } from '~/common/i18n'

type ApiErrorsContent = ReturnType<typeof getLocalizedContent<'api-errors'>>

type ExactApiErrorKey = {
  [K in keyof ApiErrorsContent]: ApiErrorsContent[K] extends string ? K : never
}[keyof ApiErrorsContent]

const EXACT_MESSAGES: Record<string, ExactApiErrorKey> = {
  'Too many requests, please try again later': 'tooManyRequests',
  Forbidden: 'forbidden',
  'Resource not found': 'resourceNotFound',
  'Resource already exists': 'resourceAlreadyExists',
  'Invalid or expired OAuth state': 'invalidOAuthState',
  'Missing Google ID token': 'missingGoogleIdToken',
  'Google email is not verified': 'googleEmailNotVerified',
  'Username must be a string': 'usernameMustBeString',
  'Username must be at least 4 characters': 'usernameMin',
  'Username must be at most 25 characters': 'usernameMax',
  'Username may only contain letters, numbers, and underscores': 'usernamePattern',
  'Display name must be a string': 'displayNameMustBeString',
  'Display name must be at least 2 characters': 'displayNameMin',
  'Display name must be at most 50 characters': 'displayNameMax',
  'User not found': 'userNotFound',
  'File is required': 'fileRequired',
  'File must be a JPEG, PNG, or WebP image': 'fileImageType',
  'Invalid image': 'invalidImage',
  'Review not found': 'reviewNotFound',
  'No fields to update': 'noFieldsToUpdate',
  'Media not found': 'mediaNotFound',
  'Media must be reviewed before adding to a ranked list': 'mediaMustBeReviewed',
  'List not found': 'listNotFound',
  'Item not found': 'itemNotFound',
  'Media is already in this list': 'mediaAlreadyInList',
  'Planned item already exists': 'plannedItemExists',
  'Planned item not found': 'plannedItemNotFound',
  'File exceeds the 5MB limit': 'fileTooLarge',
  'File must be a CSV export from IMDb': 'fileMustBeCsv',
  'CSV is empty': 'csvEmpty',
  'CSV has no rating rows': 'csvNoRatingRows',
  'Invalid CSV': 'invalidCsv',
  'An import is already in progress': 'importAlreadyInProgress',
  'Import is already in progress': 'importAlreadyInProgress',
  'Nothing left to retry': 'nothingLeftToRetry',
  'Import job not found': 'importJobNotFound',
  'Failed to enqueue import': 'failedToEnqueueImport',
  'Import stalled and was marked failed': 'importStalled',
  'Import failed': 'importFailed',
  'Invalid rating': 'invalidRating',
  'Invalid IMDb id': 'invalidImdbId',
  'Missing title': 'missingTitle',
  'Title not found on TMDB': 'titleNotFoundOnTmdb',
  'Unknown error': 'unknownError',
  'Invalid media type': 'invalidMediaType',
  'Movie not found': 'movieNotFound',
  'TV show not found': 'tvShowNotFound',
  'Book not found': 'bookNotFound',
  'Game not found': 'gameNotFound',
  'page must be a positive integer': 'pageMustBePositiveInteger',
  'Cannot revoke the current session': 'cannotRevokeCurrentSession',
  'Session not found': 'sessionNotFound',
  'Failed to destroy session': 'failedToDestroySession',
  'Failed to save session, please try again': 'failedToSaveSession',
  'Failed to persist session metadata': 'failedToPersistSession',
  'Failed to revoke session': 'failedToRevokeSession',
  'Failed to revoke sessions': 'failedToRevokeSessions',
  'Cursor must be a valid UUID': 'cursorMustBeUuid',
  'Internal server error': 'fallback',
}

const POSITION_PATTERN = /^Position must be between 1 and (\d+)$/
const CSV_MISSING_COLUMNS_PREFIX = 'CSV is missing required columns: '
const CSV_ROW_LIMIT_PATTERN = /^CSV exceeds the limit of (\d+) rows$/

const translateOne = (message: string): string => {
  const content = getLocalizedContent('api-errors')
  const exactKey = EXACT_MESSAGES[message]

  if (exactKey) {
    return content[exactKey]
  }

  const positionMatch = POSITION_PATTERN.exec(message)
  if (positionMatch) {
    return String(content.positionOutOfRange({ max: positionMatch[1] }))
  }

  if (message.startsWith(CSV_MISSING_COLUMNS_PREFIX)) {
    return String(
      content.csvMissingColumns({ columns: message.slice(CSV_MISSING_COLUMNS_PREFIX.length) }),
    )
  }

  const csvLimitMatch = CSV_ROW_LIMIT_PATTERN.exec(message)
  if (csvLimitMatch) {
    return String(content.csvRowLimit({ max: csvLimitMatch[1] }))
  }

  return message
}

export const translateApiErrorMessage = (
  message: string,
  options?: { fields?: readonly string[] },
): string => {
  if (options?.fields?.includes('username') && message === 'Resource already exists') {
    return getLocalizedContent('api-errors').usernameTaken
  }

  const parts = message
    .split('. ')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

  if (parts.length > 1) {
    return parts.map((part) => translateOne(part)).join('. ')
  }

  return translateOne(message)
}
