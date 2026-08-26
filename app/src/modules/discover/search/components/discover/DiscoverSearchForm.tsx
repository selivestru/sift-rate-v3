import { useState } from 'react'
import { useIntlayer } from 'react-intlayer'
import { Search, X } from 'reicon-react'

import { Button } from '~/common/ui/Button'
import { Input } from '~/common/ui/Input'
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
  const shared = useIntlayer('shared')
  const [draft, setDraft] = useState(initialQuery)

  const trimmed = draft.trim()
  const canSubmit = trimmed.length >= 2

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    onSearch(trimmed)
  }

  const handleClear = () => {
    setDraft('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full grid-cols-1 grid-rows-2 gap-2 sm:grid-cols-[1fr_120px] sm:grid-rows-1"
    >
      <Input
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        endIcon={
          draft.length > 0 && (
            <Button isIconOnly variant="ghost" size="sm" onClick={handleClear}>
              <X className="size-4" />
            </Button>
          )
        }
        placeholder={placeholder}
        className="gap-0 pr-0"
      />

      <Button fullWidth type="submit" isDisabled={!canSubmit || isFetching}>
        {isFetching ? <Spinner className="text-foreground" /> : <Search className="size-4" />}
        {shared.search.value}
      </Button>
    </form>
  )
}
