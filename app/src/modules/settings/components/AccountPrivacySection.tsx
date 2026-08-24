import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastApiError } from '~/common/api'
import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { Spinner } from '~/common/ui/Spinner'
import { Switch } from '~/common/ui/Switch'
import { useAuthStore } from '~/modules/auth'
import { useUpdatePrivacyMutation } from '~/modules/user'

import { SettingsSection } from './SettingsSection'

export const AccountPrivacySection = () => {
  const isPrivate = useAuthStore((state) => state.user?.isPrivate)
  const setIsPrivate = useAuthStore((state) => state.setIsPrivate)
  const mutation = useUpdatePrivacyMutation()
  const queryClient = useQueryClient()

  const handleChange = async (checked: boolean) => {
    if (mutation.isPending) return

    try {
      const response = await mutation.mutateAsync(checked)
      setIsPrivate(response.isPrivate)

      if (response.isPrivate) {
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.followRequests })
        queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.followRequestsCount })
      }

      toast.success(response.isPrivate ? 'Profile is now private' : 'Profile is now public')
    } catch (error) {
      await toastApiError(error)
    }
  }

  return (
    <SettingsSection
      title="Profile visibility"
      description="Control who can see your personal archive."
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium">Private profile</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Only approved followers can view your activity, reviews, and library.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {mutation.isPending && <Spinner className="size-6" />}
          <Switch
            size="lg"
            checked={!!isPrivate}
            onCheckedChange={handleChange}
            disabled={mutation.isPending}
            aria-label="Private profile"
          />
        </div>
      </div>
    </SettingsSection>
  )
}
