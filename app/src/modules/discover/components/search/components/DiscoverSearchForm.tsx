import { SearchIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '~/common/ui/Button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/common/ui/InputGroup'
import { Spinner } from '~/common/ui/Spinner'

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
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
        />
        <InputGroupAddon align="inline-end">
          <Button onClick={handleClear}>
            <XIcon className="size-4" />
          </Button>
        </InputGroupAddon>
      </InputGroup>

      <Button fullWidth type="submit" size="lg" isDisabled={!canSubmit || isFetching}>
        {isFetching ? <Spinner color="current" /> : <SearchIcon className="size-4" />}
        Search
      </Button>
    </form>
  )
}
