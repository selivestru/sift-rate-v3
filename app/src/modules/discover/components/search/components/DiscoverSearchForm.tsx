import { Button, SearchField, Spinner } from '@heroui/react'
import { SearchIcon } from 'lucide-react'
import { useState } from 'react'

interface DiscoverSearchFormProps {
  initialQuery: string
  placeholder: string
  isFetching: boolean
  onSearch: (query: string) => void
}

export const DiscoverSearchForm = ({
  initialQuery,
  placeholder,
  isFetching,
  onSearch,
}: DiscoverSearchFormProps) => {
  const [draft, setDraft] = useState(initialQuery)

  const trimmed = draft.trim()
  const canSubmit = trimmed.length >= 2

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    onSearch(trimmed)
  }

  const handleClear = () => {
    onSearch('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full grid-cols-1 grid-rows-2 gap-2 sm:grid-cols-[1fr_150px] sm:grid-rows-1"
    >
      <SearchField fullWidth value={draft} onChange={setDraft} aria-label="Search">
        <SearchField.Group className="h-10">
          <SearchField.SearchIcon />
          <SearchField.Input className="h-full" placeholder={placeholder} />
          <SearchField.ClearButton onPress={handleClear} />
        </SearchField.Group>
      </SearchField>

      <Button fullWidth type="submit" size="lg" isDisabled={!canSubmit || isFetching}>
        {isFetching ? <Spinner size="sm" color="current" /> : <SearchIcon className="size-4" />}
        Search
      </Button>
    </form>
  )
}
