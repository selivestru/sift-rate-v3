import { useIntlayer } from 'react-intlayer'

import { Button } from '~/common/ui/Button'

interface PlannedListErrorProps {
  onRetry: () => void
}

export const PlannedListError = ({ onRetry }: PlannedListErrorProps) => {
  const shared = useIntlayer('shared')

  return (
    <div className="bg-card border-border text-destructive flex flex-col items-center gap-3 rounded-xl border px-4 py-8 text-center text-sm">
      <p className="font-medium">{shared.somethingWentWrong.value}</p>
      <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
        {shared.tryAgainLater.value}
      </p>
      <Button variant="secondary" onClick={onRetry}>
        {shared.retry.value}
      </Button>
    </div>
  )
}
