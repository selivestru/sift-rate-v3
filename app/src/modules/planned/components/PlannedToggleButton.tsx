import { Bookmark } from 'reicon-react'

import { toastApiError } from '~/common/api'
import type { MediaType } from '~/common/constants/media-type'
import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'

import { useAddToPlannedList } from '../hook/useAddToPlannedList'
import { useDeletePlannedItem } from '../hook/useDeletePlannedItem'

interface PlannedToggleButtonProps {
  id?: string
  externalId: string
  mediaType: MediaType
}

export const PlannedToggleButton = ({ id, ...props }: PlannedToggleButtonProps) => {
  const addMutation = useAddToPlannedList()
  const deleteMutation = useDeletePlannedItem()

  const isPlanned = !!id
  const isLoading = addMutation.isPending || deleteMutation.isPending

  const handleToggle = async () => {
    try {
      if (isPlanned) {
        await deleteMutation.mutateAsync(id)
      } else {
        await addMutation.mutateAsync(props)
      }
    } catch (error) {
      await toastApiError(error)
    }
  }

  return (
    <Button
      variant={isPlanned ? 'secondary' : 'outline'}
      isLoading={isLoading}
      startIcon={<Bookmark className={cn(isPlanned && 'fill-current')} aria-hidden />}
      onClick={handleToggle}
      aria-label={isPlanned ? 'Remove from planned' : 'Add to planned'}
    >
      {isPlanned ? 'Planned' : 'Plan'}
    </Button>
  )
}
