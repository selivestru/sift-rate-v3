import { toast } from 'sonner'

import { toastApiError } from '~/common/api'
import { Spinner } from '~/common/ui/Spinner'
import { Switch } from '~/common/ui/Switch'
import { useAuthStore } from '~/modules/auth'
import { useUpdatePrivacyMutation } from '~/modules/user'

import { SettingsSection } from './SettingsSection'

export const AccountPrivacySection = () => {
  const isPrivate = useAuthStore((state) => state.user?.isPrivate)
  const setIsPrivate = useAuthStore((state) => state.setIsPrivate)
  const mutation = useUpdatePrivacyMutation()

  const handleChange = async (checked: boolean) => {
    if (mutation.isPending) return

    try {
      const response = await mutation.mutateAsync(checked)
      setIsPrivate(response.isPrivate)
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
